const mongoose = require('mongoose');

const { SiteVersion } = require('./models');
const { updatePages } = require('./pages');
const { updateFields } = require('./fields');
const { publishVersion, setCurrentVersion } = require('./versions');
const { publishDeployment } = require('./deployment');

/**
 * @param {object} options
 * @param {string} options.version The version to set.
 * @param {Array<Object>} options.pages Pages set for this version.
 * @param {Array<Object>} options.fields Fields set for this version.
 * @return {Promise}
 *
 * Publishes a version of the site.
 */
async function publish(options = {}) {
  const { version, pages, fields, user, deployment } = options;
  if (!version) {
    throw new Error('Version required.');
  } else {
    if (await SiteVersion.exists({ name: version })) {
      throw new Error(`Version ${version} exists.`);
    }
  }

  await withTransaction(async () => {
    await updatePages(version, pages);
    await updateFields(version, fields);
    await publishVersion(version, user);
    await publishDeployment(deployment);
  });
}

async function revert(options = {}) {
  const { version, deployment } = options;
  if (!version) {
    throw new Error('Version required.');
  }
  await withTransaction(async () => {
    await setCurrentVersion(version);
    await publishDeployment(deployment);
  });
}

async function withTransaction(fn) {
  const session = await mongoose.startSession();
  await session.withTransaction(fn);
}

module.exports = {
  publish,
  revert,
};
