const mongoose = require('mongoose');

const { getVersions, setCurrentVersion } = require('../src/versions');
const { getSiteData } = require('../src/data');
const { SiteVersion } = require('../src/models');
const { mockTime, unmockTime } = require('./time');

describe('getVersions', () => {
  it('should get all site versions', async () => {
    mockTime('2020-02-01');
    await SiteVersion.create({
      name: 'v1',
      user: new mongoose.Types.ObjectId(),
    });
    await SiteVersion.create({
      name: 'v2',
      current: true,
      user: new mongoose.Types.ObjectId(),
    });
    const versions = await getVersions();
    expect(versions).toEqual([
      {
        name: 'v1',
        current: false,
        publishedAt: new Date(),
      },
      {
        name: 'v2',
        current: true,
        publishedAt: new Date(),
      },
    ]);
    unmockTime();
  });
});

describe('setVersion', () => {
  it('should set the current version', async () => {
    mockTime('2020-02-01');
    await SiteVersion.create({
      name: 'v1',
      current: true,
      user: new mongoose.Types.ObjectId(),
    });
    await SiteVersion.create({
      name: 'v2',
      current: false,
      user: new mongoose.Types.ObjectId(),
    });
    await setCurrentVersion('v2');
    const data = await getSiteData();
    expect(data).toEqual({
      version: 'v2',
      publishedAt: new Date(),
      pages: [],
      fields: [],
    });
    unmockTime();
  });

  it('should fail no version provided', async () => {
    await expect(async () => {
      await setCurrentVersion();
    }).rejects.toThrow();
  });

  it('should fail if version not found', async () => {
    await expect(async () => {
      await setCurrentVersion('v2');
    }).rejects.toThrow();
  });

  it('should fail if version already current', async () => {
    await SiteVersion.create({
      name: 'v1',
      current: true,
      user: new mongoose.Types.ObjectId(),
    });
    await expect(async () => {
      await setCurrentVersion('v1');
    }).rejects.toThrow();
  });
});
