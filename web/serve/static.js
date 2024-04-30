const Koa = require('koa');

const koaMount = require('koa-mount');

const config = require('@bedrockio/config');

const envMiddleware = require('./middleware/env');
const assetsMiddleware = require('./middleware/assets');
const templateMiddleware = require('./middleware/template');
const healthCheckMiddleware = require('./middleware/healthCheck');

const SERVER_PORT = config.get('SERVER_PORT');
const SERVER_HOST = config.get('SERVER_HOST');

const app = new Koa();

app.use(healthCheckMiddleware);

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
