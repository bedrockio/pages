const { minimizer } = require('./webpack.plugins.js');

const config = require('./webpack.shared.js');

module.exports = {
  ...config,
  target: 'node',
  mode: 'production',
  entry: {
    generator: './src/generator.entry.js',
  },
  module: {
    rules: [
      ...config.module.rules,
      {
        test: /\.(css|less)$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
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
