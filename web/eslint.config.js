const path = require('path');

const babelParser = require('@babel/eslint-parser');

const {
  react,
  recommended,
  webpackImports,
} = require('@bedrockio/eslint-plugin');

module.exports = [
  react,
  recommended,
  webpackImports,
  {
    files: ['**/*.js'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        babelOptions: {
          configFile: path.resolve(__dirname, 'babel.config.js'),
        },
      },
    },
    settings: {
      'import/resolver': {
        webpack: {
          config: path.resolve(__dirname, 'webpack.shared.js'),
        },
        node: {
          moduleDirectory: ['node_modules'],
        },
      },
    },
  },
];
