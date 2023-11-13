const path = require('path');

const DIRS = ['apps', 'components', 'providers', 'stores', 'utils'];

module.exports = {
  env: {
    node: true,
    browser: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    sourceType: 'module',
    ecmaFeatures: {
      legacyDecorators: true,
    },
    babelOptions: {
      configFile: path.join(__dirname, 'babel.config.js'),
    },
  },
  extends: [
    'plugin:bedrock/recommended',
    'plugin:bedrock/imports-node',
    'plugin:bedrock/react',
  ],
  rules: {
    'import/no-unresolved': 'warn',
    'import/no-named-as-default-member': 'off',
    'import/order': [
      'warn',
      {
        'newlines-between': 'always-and-inside-groups',
        pathGroups: [
          {
            pattern: '+(stores|helpers|layouts)',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '+(stores|helpers|layouts)/**',
            group: 'internal',
            position: 'before',
          },
          {
            pattern: '+(screens|modals|components)',
            group: 'internal',
          },
          {
            pattern: '+(screens|modals|components)/**',
            group: 'internal',
          },
          {
            pattern: 'utils',
            group: 'internal',
            position: 'after',
          },
          {
            pattern: 'utils/**',
            group: 'internal',
            position: 'after',
          },
        ],
        groups: [
          'builtin',
          'unknown',
          'external',
          'internal',
          ['parent', 'sibling'],
          'index',
          'object',
          'type',
        ],
      },
    ],
  },
  settings: {
    'import/resolver': {
      'babel-module': {
        resolvePath: (file) => {
          const [first] = file.split('/');
          if (DIRS.includes(first)) {
            return path.resolve(__dirname, 'src', file);
          }
        },
      },
    },
  },
};
