const path = require('path');

const config = require('@bedrockio/config');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { template: compileTemplate } = require('lodash');

const ENV = config.getAll();

module.exports = {
  output: {
    publicPath: '/',
    filename: 'assets/[name].[contenthash].js',
    assetModuleFilename: 'assets/[contenthash][ext]',
  },
  resolve: {
    extensions: ['.mjs', '.js', '.json', '.jsx'],
    modules: ['src', 'node_modules'],
    // Webpack's chooses "browser" first by default which can increase
    // bundle sizes as this is often pre-bundled code.
    mainFields: ['module', 'main', 'browser'],
    alias: {
      lodash: 'lodash-es',
    },
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        type: 'javascript/auto',
        loader: require.resolve('babel-loader'),
        exclude: /node_modules/,
        options: {
          configFile: require.resolve('./.babelrc.json'),
        },
      },
      {
        test: /@.+\.(png|jpg|gif|webp|avif|svg|mp4|pdf|eot|ttf|woff2?)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][ext]',
        },
      },
      {
        test: /\.(png|jpg|gif|webp|avif|svg|mp4|pdf|eot|ttf|woff2?)$/,
        type: 'asset/resource',
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
        exclude: path.resolve('src/index.html'),
        options: {
          esModule: false,
          preprocessor: (source, ctx) => {
            try {
              return compileTemplate(source)(ENV);
            } catch (err) {
              ctx.emitError(err);
              return source;
            }
          },
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'assets/[name].[contenthash].css',
      ignoreOrder: true,
    }),
    new CircularDependencyPlugin({
      exclude: /node_modules/,
      failOnError: true,
      cwd: process.cwd(),
    }),

    // Favicons plugin occasionally makes webpack build fail due with error:
    // glib: SVG has no elements
    //
    // This error is intermittent and tracked here:
    // https://github.com/jantimon/favicons-webpack-plugin/issues/200
    new FaviconsWebpackPlugin({
      logo: './src/assets/favicon.svg',

      // Set devMode to "webapp" to test PWA stuff on dev.
      mode: 'webapp',
      devMode: 'light',

      // https://github.com/itgalaxy/favicons#usage
      favicons: {
        appName: '', // Your application's name.
        dir: 'auto', // Primary text direction for name, short_name, and description
        lang: 'en-US', // Primary language for name and short_name
        background: '#fff', // Background colour for flattened icons.
        theme_color: '#fff', // Theme color user for example in Android's task switcher.
        appleStatusBarStyle: 'black-translucent', // Style for Apple status bar: "black-translucent", "default", "black". Not actually black!.
        display: 'fullscreen', // Preferred display mode: "fullscreen", "standalone", "minimal-ui" or "browser".
        orientation: 'portrait', // Default orientation: "any", "natural", "portrait" or "landscape".
        loadManifestWithCredentials: true, // Browsers don't send cookies when fetching a manifest, enable this to fix that.
        icons: {
          android: true,
          appleIcon: true,
          appleStartup: true,
          favicons: true,
          windows: true,
          yandex: false,
        },
      },
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve('src/public'),
          noErrorOnMissing: true,
        },
      ],
    }),
  ],
};
