const path = require('path');

const { BUILD_DIR } = process.env;

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
  plugins: [
    ...(BUILD_DIR
      ? [
          [
            'babel-plugin-module-resolver',
            {
              alias: {
                mongoose: path.join(BUILD_DIR, 'node_modules/mongoose'),
                '@bedrockio/model': path.join(BUILD_DIR, 'node_modules/@bedrockio/model'),
                '@bedrockio/yada': path.join(BUILD_DIR, 'node_modules/@bedrockio/yada'),
              },
            },
          ],
        ]
      : []),
  ],
};
