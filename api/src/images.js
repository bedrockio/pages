const path = require('path');
const fs = require('fs/promises');

const sharp = require('sharp');
const { round } = require('lodash');

async function createImageSet(options) {
  const { file, sizes } = options;

  const filename = resolveFilename(file);
  const filepath = resolveFilepath(file);

  const ext = path.extname(filename);
  const base = path.basename(filename, ext);
  const buffer = await fs.readFile(filepath);
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

// Supports formidable
function resolveFilename(file) {
  return typeof file === 'string' ? file : file?.originalFilename;
}

// Supports formidable
function resolveFilepath(file) {
  return typeof file === 'string' ? path.resolve(file) : file?.filepath;
}

module.exports = {
  createImageSet,
};
