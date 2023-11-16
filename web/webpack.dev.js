const webpack = require('webpack');

const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const config = require('./webpack.shared.js');
const { html } = require('./webpack.plugins.js');

module.exports = {
  ...config,
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  entry: [
    require.resolve('webpack-hot-middleware/client'),
    './src/dev.entry.js',
  ],
  module: {
    rules: [
      ...config.module.rules,
      {
        test: /\.(css|less)$/,
        use: [
          require.resolve('style-loader'),
          require.resolve('css-loader'),
          require.resolve('less-loader'),
        ],
      },
    ],
  },
  plugins: [
    ...config.plugins,
    new ReactRefreshWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    html(),
  ],
};
