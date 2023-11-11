const path = require('path');
const fs = require('fs/promises');

const sharp = require('sharp');
const { round } = require('lodash');

const { createUploads } = require('./uploads');

async function createImageSet(options) {
  const { file, sizes, authUser } = options;

  const filename = file.originalFilename;
  const ext = path.extname(filename);
  const base = path.basename(filename, ext);
  const buffer = await fs.readFile(file.filepath);
  const image = sharp(buffer);

  const metadata = await image.metadata();

  const ratio = round(metadata.width / metadata.height, 3);

  const images = [];

  for (let size of sizes) {
    const file = {
      buffer: await image.resize(size).avif().toBuffer(),
      filename: `${base}@${size}w.avif`,
      mimetype: 'image/avif',
    };
    const [upload] = await createUploads(file, {
      user: authUser,
    });
    images.push({
      size,
      upload,
    });
  }

  return {
    ratio,
    images,
  };
}

module.exports = {
  createImageSet,
};
