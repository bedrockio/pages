const { assertPatched, assertNotPatched } = require('@kubernetes/client-node');

const { publishSite } = require('../src/publish');
const { SiteVersion, SiteField } = require('../src/models');
const { mockTime, unmockTime } = require('./time');

describe('publishSite', () => {
  it('should publish site version', async () => {
    mockTime('2020-02-01');
    await publishSite({
      version: 'v1',
    });
    const version = await SiteVersion.findOne({
      name: 'v1',
    });
    expect(version.current).toBe(true);
    expect(version.publishedAt).toEqual(new Date());
    unmockTime();
  });

  it('should publish site fields', async () => {
    await publishSite({
      version: 'v1',
      fields: [
        {
          name: 'foo',
          type: 'string',
          value: 'bar',
        },
      ],
    });
    const field = await SiteField.findOne({
      name: 'foo',
      value: 'bar',
    });
    expect(field.version).toBe('v1');
  });

  it('should unset previous version as current', async () => {
    await SiteVersion.create({
      name: 'v1',
      current: true,
    });
    await publishSite({
      version: 'v2',
    });
    const version = await SiteVersion.findOne({
      name: 'v1',
    });
    expect(version.current).toBe(false);
  });

  it('should update deployment in GKE environment', async () => {
    process.env.KUBERNETES_SERVICE_HOST = '0.0.0.0';
    await publishSite({
      version: 'v1',
      deployment: 'test-deployment',
    });
    assertPatched('test-deployment');
    delete process.env.KUBERNETES_SERVICE_HOST;
  });

  it('should not update deployment outside of GKE', async () => {
    await publishSite({
      version: 'v1',
    });
    assertNotPatched();
  });
});
