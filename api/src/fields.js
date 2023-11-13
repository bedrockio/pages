const { SiteField } = require('./models');

async function getFields(version) {
  const fields = await SiteField.find({
    version,
  });
  return fields.map((field) => {
    const { name, type, value, upload } = field;
    return {
      name,
      type,
      value,
      upload,
    };
  });
}

async function updateFields(version, fields = []) {
  for (let field of fields) {
    await SiteField.create({
      ...field,
      version,
    });
  }
}

module.exports = {
  getFields,
  updateFields,
};
