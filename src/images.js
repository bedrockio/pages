const path = require('path');
const fs = require('fs/promises');

const sharp = require('sharp');
const { round } = require('lodash');

async function createImageSet(options) {
  const { file, sizes } = options;

  const filename = file.originalFilename;
  const ext = path.extname(filename);
  const base = path.basename(filename, ext);
  const buffer = await fs.readFile(file.filepath);
  const image = sharp(buffer);

  const metadata = await image.metadata();

  const ratio = round(metadata.width / metadata.height, 3);

  const files = [];

  for (let size of sizes) {
    const file = {
      size,
      buffer: await image.resize(size).avif().toBuffer(),
      filename: `${base}@${size}w.avif`,
      mimeType: 'image/avif',
    };
    files.push(file);
  }

  return {
    ratio,
    files,
  };
}

module.exports = {
  createImageSet,
};
