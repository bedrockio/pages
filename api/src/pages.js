const { SitePage } = require('./models');

async function getPages(version) {
  const pages = await SitePage.find({
    version,
  });
  return pages.map((page) => {
    const { name, path, type, nav } = page;
    return {
      name,
      path,
      type,
      nav,
    };
  });
}

async function updatePages(version, pages = []) {
  for (let page of pages) {
    await SitePage.create({
      ...page,
      version,
    });
  }
}

module.exports = {
  getPages,
  updatePages,
};
