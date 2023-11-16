const mongoose = require('mongoose');

const { getSiteData } = require('../src/data');
const { SiteVersion, SiteField } = require('../src/models');
const { mockTime, unmockTime } = require('./time');

describe('getSiteData', () => {
  it('should fetch initial site data', async () => {
    const data = await getSiteData();
    expect(data).toEqual({});
  });

  it('should fetch current site data', async () => {
    mockTime('2020-02-01');
    await SiteVersion.create({
      name: 'v1',
      current: true,
      user: new mongoose.Types.ObjectId(),
    });
    await SiteField.create({
      name: 'foo',
      type: 'string',
      value: 'bar',
      version: 'v1',
    });
    const data = await getSiteData();
    expect(data).toEqual({
      version: 'v1',
      publishedAt: new Date(),
      pages: [],
      fields: [
        {
          name: 'foo',
          type: 'string',
          value: 'bar',
        },
      ],
    });
    unmockTime();
  });

  it('should fetch site data for specific version', async () => {
    await SiteVersion.create({
      name: 'v1',
      publishedAt: '2020-01-01T00:00:00.000Z',
      user: new mongoose.Types.ObjectId(),
    });

    await SiteVersion.create({
      name: 'v2',
      publishedAt: '2020-01-02T00:00:00.000Z',
      user: new mongoose.Types.ObjectId(),
    });

    await SiteField.create({
      name: 'foo',
      type: 'string',
      value: 'bar',
      version: 'v1',
    });

    await SiteField.create({
      name: 'foo',
      type: 'string',
      value: 'baz',
      version: 'v2',
    });

    const data = await getSiteData('v1');

    expect(data).toEqual({
      version: 'v1',
      publishedAt: new Date('2020-01-01T00:00:00.000Z'),
      pages: [],
      fields: [
        {
          name: 'foo',
          type: 'string',
          value: 'bar',
        },
      ],
    });
  });
});
