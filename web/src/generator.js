import fs from 'fs';
import path from 'path';

import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';

import { DataProvider } from 'stores/data';

export default async function generator(options) {
  const { App, Router, template, data } = options;
  const router = Router(data);
  const urls = getPaths(router);

  const files = [];

  for (let url of urls) {
    const helmetContext = {};
    const content = renderToString(
      <HelmetProvider context={helmetContext} prioritizeSeoTags>
        <StaticRouter location={url}>
          <DataProvider data={data}>
            <App />
          </DataProvider>
        </StaticRouter>
      </HelmetProvider>,
    );

    const head = getHeadForContext(helmetContext);

    let html = template;

    html = html.replace('<!-- HEAD -->', head);
    html = html.replace('<!-- BODY -->', content);
    html = html.replace(
      '<!-- env:data -->',
      `<script>__DATA__ = ${JSON.stringify(data)}</script>`,
    );
    let file = url.slice(1);
    if (file.includes('/')) {
      fs.mkdirSync(`dist/${path.dirname(file)}`, {
        recursive: true,
      });
    }
    file = getFileForUrl(url);
    file = path.resolve(`dist/${file}`);
    fs.writeFileSync(file, html, 'utf-8');

    files.push(file);
  }

  return files;
}

function getFileForUrl(url) {
  if (url === '/') {
    return 'index.html';
  } else if (url === '/*') {
    return '404.html';
  } else {
    return `${url}.html`;
  }
}

function getHeadForContext(context) {
  const { helmet } = context;
  let head = '';
  for (let value of Object.values(helmet)) {
    head += value.toString();
  }
  return head;
}

function getPaths(arg, prefix = '') {
  if (Array.isArray(arg)) {
    return arg.flatMap((el) => {
      return getPaths(el, prefix);
    });
  }
  let { path, element, children } = arg.props;
  let paths = [];
  if (path && element) {
    if (!path.startsWith('/')) {
      path = '/' + path;
    }
    paths = [prefix + path];
  }
  if (children) {
    paths = [...paths, ...getPaths(children, path)];
  }
  return paths;
}
