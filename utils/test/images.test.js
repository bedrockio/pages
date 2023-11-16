const path = require('path');

const { createImageSet } = require('../src/images');

describe('publishSite', () => {
  it('should create an image set', async () => {
    const set = await createImageSet({
      file: {
        originalFilename: 'test.png',
        filepath: path.join(__dirname, '__fixtures__/test.png'),
      },
      sizes: [600, 1200],
    });

    expect(set).toMatchObject({
      ratio: 1,
      files: [
        {
          size: 600,
          filename: 'test@600w.avif',
          mimeType: 'image/avif',
        },
        {
          size: 1200,
          filename: 'test@1200w.avif',
          mimeType: 'image/avif',
        },
      ],
    });
  });
});
