const { createImageSet } = require('@bedrockio/pages-utils');

const { getSiteData } = require('./data');
const { publishSite } = require('./publish');
const { getVersions, setCurrentVersion } = require('./versions');

module.exports = {
  getSiteData,
  publishSite,
  getVersions,
  createImageSet,
  setCurrentVersion,
};
