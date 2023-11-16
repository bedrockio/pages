const { getVersion } = require('./versions');
const { getFields } = require('./fields');
const { getPages } = require('./pages');

/**
 * @param {string} versionName
 *
 * Fetches all site data for a given version.
 */
async function getSiteData(versionName) {
  const version = await getVersion(versionName);
  if (!version) {
    return {
      pages: [],
      fields: [],
    };
  }
  const { name, publishedAt } = version;
  return {
    version: name,
    publishedAt,
    pages: await getPages(name),
    fields: await getFields(name),
  };
}

module.exports = {
  getSiteData,
};
