import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

import config from '@bedrockio/config';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

import { injectData } from './src/utils/data.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const { SERVER_HOST, SERVER_PORT, ...PUBLIC } = config.getAll();

export default function plugin() {
  return [react(), entry(), setup(), data(), analyze()];
}

function entry() {
  // Slightly silly but transformIndexHtml doesn't have
  // access to the mode until the config is resolved.
  let entry;
  return {
    name: 'html-entry-injector',
    configResolved({ mode }) {
      entry = mode === 'development' ? 'dev.entry.js' : 'client.entry.js';
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html.replace('%ENTRY%', entry);
      },
    },
  };
}

function setup() {
  return {
    name: 'pages-build-config',
    config(config, { mode }) {
      return defineConfig({
        root: 'src',
        publicDir: 'public',
        define: define(mode),

        server: {
          host: SERVER_HOST,
          port: SERVER_PORT,
          allowedHosts: true,
        },

        resolve: {
          alias: {
            '@data': resolve(__dirname, 'src/client/data'),
            '@utils': resolve(__dirname, 'src/client/utils'),
            '@components': resolve(__dirname, 'src/client/components'),
          },
        },

        build: {
          outDir: '../dist',
          assetsInlineLimit: (file) => {
            return !file.endsWith('.svg');
          },
        },

        // All of this is for using .js files as .jsx.
        esbuild: {
          loader: 'jsx',
          include: /.*\.jsx?$/,
          exclude: [],
        },
        optimizeDeps: {
          esbuildOptions: {
            loader: {
              '.js': 'jsx',
            },
          },
        },
      });
    },
  };
}

function define(mode) {
  // Inject environment variables into the template.
  // This will be done by the server in production.
  if (mode === 'development') {
    return {
      'global.env': JSON.stringify(PUBLIC),
    };
  }
}

function data() {
  // Inject data into the template.
  // This will be done by the server in production.
  return {
    name: 'html-data-injector',
    async transformIndexHtml(html) {
      return await injectData(html);
    },
  };
}

function analyze() {
  if (process.env.ANALYZE) {
    return visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      template: process.env.ANALYZE,
      filename: 'dist/stats.html',
    });
  }
}
