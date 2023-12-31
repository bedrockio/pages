const { SiteVersion } = require('./models');

async function getVersions() {
  const versions = await SiteVersion.find().sort({ publishedAt: -1 });
  return versions.map((version) => {
    const { name, current, publishedAt } = version;
    return { name, current, publishedAt };
  });
}

async function searchVersions(query) {
  return await SiteVersion.search(query);
}

async function getVersion(name) {
  let version;
  if (name) {
    version = await SiteVersion.findOne({
      name,
    });
    if (!version) {
      throw new Error(`Could not resolve version for ${name}.`);
    }
  } else {
    version = await SiteVersion.findOne({
      current: true,
    });
  }
  return version;
}

async function publishVersion(name, user) {
  await SiteVersion.create({
    name,
    user,
  });
  await setCurrentVersion(name);
}

async function getCurrentVersion() {
  return await SiteVersion.findOne({
    current: true,
  });
}

async function setCurrentVersion(name) {
  if (!name) {
    throw new Error('Name required.');
  }
  const version = await getVersion(name);
  if (!version) {
    throw new Error(`Version ${name} not found.`);
  } else if (version.current) {
    throw new Error(`Version ${name} is already current.`);
  }
  await SiteVersion.updateOne(
    {
      current: true,
    },
    {
      $set: {
        current: false,
      },
    },
  );
  version.current = true;
  await version.save();
}

module.exports = {
  getVersion,
  getVersions,
  searchVersions,
  publishVersion,
  getCurrentVersion,
  setCurrentVersion,
};
