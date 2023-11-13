const config = require('@bedrockio/config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const ENV = config.getAll();

module.exports = {
  html(filename = 'index.html') {
    return new HtmlWebpackPlugin({
      filename,
      template: './src/index.html',
      templateParameters: {
        ...ENV,
      },
      minify: {
        collapseWhitespace: true,
        keepClosingSlash: true,
        removeComments: false,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      },
      inject: true,
    });
  },
  minimizer(options) {
    return new TerserWebpackPlugin({
      ...options,
      terserOptions: {
        // Preventing function and class name mangling
        // for now to allow screen name magic to work.
        keep_fnames: true,
        keep_classnames: true,
      },
    });
  },
};
