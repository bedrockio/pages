const yd = require('@bedrockio/yada');

const { SitePage, SiteField } = require('./models');

function getPublishValidation() {
  return {
    version: yd.string().required(),
    pages: yd.array(SitePage.getCreateValidation()),
    fields: yd.array(SiteField.getCreateValidation()),
  };
}

module.exports = {
  getPublishValidation,
};
