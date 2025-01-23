const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { minimizer } = require('./webpack.plugins.js');

const config = require('./webpack.shared.js');

function getMode() {
  const { ENV_NAME = 'development' } = process.env;
  if (ENV_NAME === 'development') {
    return ENV_NAME;
  } else {
    return 'production';
  }
}

module.exports = {
  ...config,
  target: 'node',
  mode: getMode(),
  entry: {
    generator: './src/generator.entry.js',
  },
  module: {
    rules: [
      ...config.module.rules,
      {
        test: /\.(css|less)$/,
        use: [
          MiniCssExtractPlugin.loader,
          require.resolve('css-loader'),
          require.resolve('postcss-loader'),
          require.resolve('less-loader'),
        ],
      },
    ],
  },
  output: {
    ...config.output,
    filename: 'generator/index.js',
    library: {
      type: 'commonjs2',
      export: 'default',
    },
  },
  optimization: {
    minimizer: [minimizer()],
  },
};
