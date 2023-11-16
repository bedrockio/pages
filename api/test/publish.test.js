const mongoose = require('mongoose');
const { assertPatched, assertNotPatched } = require('@kubernetes/client-node');

const { publish } = require('../src/publish');
const { SiteVersion, SiteField } = require('../src/models');
const { mockTime, unmockTime } = require('./time');

describe('publish', () => {
  it('should publish site version', async () => {
    mockTime('2020-02-01');
    await publish({
      version: 'v1',
      user: new mongoose.Types.ObjectId(),
    });
    const version = await SiteVersion.findOne({
      name: 'v1',
    });
    expect(version.current).toBe(true);
    expect(version.publishedAt).toEqual(new Date());
    unmockTime();
  });

  it('should publish site fields', async () => {
    await publish({
      version: 'v1',
      fields: [
        {
          name: 'foo',
          type: 'string',
          value: 'bar',
        },
      ],
      user: new mongoose.Types.ObjectId(),
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
      user: new mongoose.Types.ObjectId(),
    });
    await publish({
      version: 'v2',
      user: new mongoose.Types.ObjectId(),
    });
    const version = await SiteVersion.findOne({
      name: 'v1',
    });
    expect(version.current).toBe(false);
  });

  it('should update deployment in GKE environment', async () => {
    process.env.KUBERNETES_SERVICE_HOST = '0.0.0.0';
    await publish({
      version: 'v1',
      deployment: 'test-deployment',
      user: new mongoose.Types.ObjectId(),
    });
    assertPatched('test-deployment');
    delete process.env.KUBERNETES_SERVICE_HOST;
  });

  it('should not update deployment outside of GKE', async () => {
    await publish({
      version: 'v1',
      user: new mongoose.Types.ObjectId(),
    });
    assertNotPatched();
  });
});
