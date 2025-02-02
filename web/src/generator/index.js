import path from 'path';
import { readFile, writeFile } from 'fs/promises';

import { build } from 'vite';
import { JSDOM } from 'jsdom';
import config from '@bedrockio/config';

import { loadData } from '../utils/data.js';

async function generate() {
  const data = await loadData();

  // This builds the client app that will
  // bootstraps the production build.
  await build({
    build: {
      emptyOutDir: true,
    },
  });

  // Ensure this is set here before starting
  // SSR build to ensure libraries that check
  // it aren't doing anything weird.
  process.env.NODE_ENV = 'development';

  // Expose browser globals as we are about
  // to run our SSR build as a node import.
  const { window } = new JSDOM('', {
    url: 'https://bedrock.foundation',
  });

  global.window = window;
  global.document = window.document;
  global.localStorage = window.localStorage;
  global.env = config.getAll();

  // Now build the generator. This works
  // like SSR but we will directly use it
  // as an import to render all pages out.
  await build({
    ssr: {
      // Note this is required as the source
      // code here includes assets like SVG
      // and LESS that must be transpiled
      // into the SSR build output.
      noExternal: ['@bedrockio/pages'],
    },
    build: {
      ssr: './generator.entry.js',
      emptyOutDir: false,
    },
  });

  // Load the main pages template.
  const template = await readFile('./dist/index.html', 'utf-8');

  // Load the generator entrypoint import with node.
  const file = path.resolve(process.cwd(), './dist/generator.entry.js');
  const { render } = await import(file);

  // The entrypoint will find the Router component,
  // extract its routes, and render each of them to
  // a string which we can write to the file system.
  const routes = render(data);

  await Promise.all(
    routes.map(async (route) => {
      const { path: url, generate } = route;
      const { prelude: readable } = await generate;
      const response = new Response(readable);
      const source = await response.text();
      const filename = url === '/' ? '/index.html' : `${url}.html`;
      const html = template.replace('<!-- BODY -->', source);
      await writeFile(path.join('dist', filename), html);
    }),
  );
}

generate();
