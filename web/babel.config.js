const path = require('path');

module.exports = {
  presets: [
    ['@babel/preset-env'],
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
  ],
  plugins: [
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true,
      },
    ],
    [
      'module-resolver',
      {
        alias: {
          '@utils': path.resolve(__dirname, './src/utils'),
          '@stores': path.resolve(__dirname, './src/stores'),
          '@components': path.resolve(__dirname, './src/components'),
        },
      },
    ],
  ],
};
