import Koa from 'koa';
import koaMount from 'koa-mount';
import config from '@bedrockio/config';
import logger from '@bedrockio/logger';

import envMiddleware from './middleware/env.js';
import assetsMiddleware from './middleware/assets.js';
import templateMiddleware from './middleware/template.js';
import healthCheckMiddleware from './middleware/healthCheck.js';

const SERVER_PORT = config.get('SERVER_PORT');
const SERVER_HOST = config.get('SERVER_HOST');

export function createServer() {
  const app = new Koa();

  app.use(healthCheckMiddleware);
  app.use(logger.middleware());

  app
    .use(koaMount('/assets/', assetsMiddleware('./dist/assets')))
    .use(koaMount('/subfont/', assetsMiddleware('./dist/subfont')))
    .use(envMiddleware())
    .use(templateMiddleware({ apps: ['/'] }));

  app.listen(SERVER_PORT, SERVER_HOST, (err) => {
    if (err) {
      throw err;
    }
    // eslint-disable-next-line
    console.info(
      `🐬  Prod App server listening at http://${SERVER_HOST}:${SERVER_PORT} 🐬\r\n\r\n`,
    );
  });
}
