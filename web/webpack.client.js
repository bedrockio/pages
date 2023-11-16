const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = require('./webpack.shared.js');
const { html, minimizer } = require('./webpack.plugins.js');

module.exports = {
  ...config,
  mode: 'production',
  devtool: 'source-map',
  entry: {
    client: './src/client.entry.js',
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
  plugins: [...config.plugins, html('generator/template.html')],
  optimization: {
    minimizer: [minimizer()],
  },
};
