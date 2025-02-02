import { react, recommended, nodeImports } from '@bedrockio/eslint-plugin';

export default [
  react,
  recommended,
  nodeImports,
  {
    settings: {
      'import/resolver': {
        alias: {
          map: [
            ['@data', './src/client/data'],
            ['@utils', './src/client/utils'],
            ['@components', './src/client/components'],
          ],
        },
      },
    },
  },
];
