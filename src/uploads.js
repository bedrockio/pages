const path = require('path');
const os = require('os');
const { promises: fs } = require('fs');
const crypto = require('crypto');

const mime = require('mime-types');
const config = require('@bedrockio/config');
const logger = require('@bedrockio/logger');
const mongoose = require('mongoose');
const { Storage } = require('@google-cloud/storage');

async function createUploads(arg, options) {
  const files = Array.isArray(arg) ? arg : [arg];
  const { user, isPrivate } = options;
  return await Promise.all(
    files.map(async (file) => {
      const params = await storeUploadedFile(file);
      params.owner = user.id;
      params.isPrivate = isPrivate;
      return await mongoose.models.Upload.create(params);
    })
  );
}

async function uploadLocal(options) {
  let { filename, filepath, hash, buffer } = options;
  const destinationPath = path.join(os.tmpdir(), hash);
  if (filepath) {
    await fs.copyFile(filepath, destinationPath);
  } else if (buffer) {
    await fs.writeFile(destinationPath, buffer);
    // TODO: why do we need the filepath?
    filepath = 'buffer';
  } else {
    throw new Error('Cannot upload local file.');
  }

  logger.debug('Uploading locally %s -> %s', filename, destinationPath);
  return destinationPath;
}

async function uploadGcs(object) {
  const { filename, filepath, hash } = object;
  const storage = new Storage();
  const bucketName = config.get('UPLOADS_GCS_BUCKET');
  const bucket = storage.bucket(bucketName);
  const extension = path.extname(filename).toLowerCase();
  const options = {
    destination: `${hash}${extension}`,
  };
  await bucket.upload(filepath, options);

  logger.info(
    'Uploading gcs %s -> gs://%s/%s',
    filename,
    bucketName,
    options.destination
  );
  const uploadedGcsFile = bucket.file(options.destination);
  await uploadedGcsFile.makePublic();
  const metaData = await uploadedGcsFile.getMetadata();
  return metaData[0].mediaLink;
}

async function storeUploadedFile(options) {
  // https://github.com/node-formidable/formidable#file
  const { filepath, originalFilename } = options;

  options.filename ||= originalFilename || path.basename(filepath || '');
  options.mimeType ||= mime.lookup(options.filename);
  options.hash = crypto.randomBytes(32).toString('hex');

  if (config.get('UPLOADS_STORE') === 'gcs') {
    options.rawUrl = await uploadGcs(options);
    options.storageType = 'gcs';
  } else {
    options.rawUrl = await uploadLocal(options);
    options.storageType = 'local';
  }
  options.thumbnailUrl = options.rawUrl;
  return options;
}

module.exports = {
  createUploads,
  storeUploadedFile,
};
