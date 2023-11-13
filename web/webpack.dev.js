const webpack = require('webpack');

const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const config = require('./webpack.shared.js');
const { html } = require('./webpack.plugins.js');

module.exports = {
  ...config,
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  output: {
    publicPath: '/',
    filename: 'assets/[name].[contenthash].js',
    assetModuleFilename: 'assets/[contenthash][ext]',
    clean: true,
  },
  entry: ['webpack-hot-middleware/client', './src/dev.entry.js'],
  module: {
    rules: [
      ...config.module.rules,
      {
        test: /\.(css|less)$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
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
