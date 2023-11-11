const path = require('path');

const { loadModel } = require('@bedrockio/model');

function load(file, name) {
  file = path.join(__dirname, 'definitions', file);
  return loadModel(require(file), name);
}

module.exports = {
  SitePage: load('site-page.json', 'SitePage'),
  SiteField: load('site-field.json', 'SiteField'),
  SiteVersion: load('site-version.json', 'SiteVersion'),
};
