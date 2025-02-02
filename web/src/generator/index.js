import path from 'path';

import { readFile, writeFile } from 'fs/promises';

import { build } from 'vite';
import { JSDOM } from 'jsdom';
import config from '@bedrockio/config';

import { loadData } from '../utils/data.js';

async function generate() {
  const data = await loadData();

  // Build once to bundle the client app
  await build();

  const { window } = new JSDOM('', {
    url: 'https://bedrock.foundation',
  });

  global.window = window;
  global.document = window.document;
  global.localStorage = window.localStorage;
  global.env = config.getAll();

  // Ensure this is set here before starting
  // SSR build to ensure libraries that check
  // it aren't doing anything weird.
  process.env.NODE_ENV = 'development';

  // Now build the generator. This works
  // like SSR but we will directly use it
  // as an import to render all pages out.
  await build({
    build: {
      ssr: './generator.entry.js',
      emptyOutDir: false,
    },
  });

  const template = await readFile('./dist/index.html', 'utf-8');

  // const { render } = await runDevelopment();
  const file = path.resolve(process.cwd(), './dist/generator.entry.js');
  const { render } = await import(file);

  const routes = render(data);
  for (let route of routes) {
    const { path: url, source } = route;

    const filename = url === '/' ? '/index.html' : `${url}.html`;
    const html = template.replace('<!-- BODY -->', source);

    await writeFile(path.join('dist', filename), html);
  }
}

generate();
