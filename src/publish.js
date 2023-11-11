const mongoose = require('mongoose');

const { SiteVersion } = require('./models');
const { updatePages } = require('./pages');
const { updateFields } = require('./fields');
const { publishVersion } = require('./versions');
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
async function publishSite(options = {}) {
  const { version, pages, fields } = options;
  if (!version) {
    throw new Error('Version required.');
  } else {
    if (await SiteVersion.exists({ name: version })) {
      throw new Error(`Version ${version} exists.`);
    }
  }

  const session = await mongoose.startSession();
  await session.withTransaction(async () => {
    await updatePages(version, pages);
    await updateFields(version, fields);
    await publishVersion(version);
    await publishDeployment();
  });
}

module.exports = {
  publishSite,
};
