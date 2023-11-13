const fetchData = require('../../fetch-data');

function dataMiddleware(options) {
  const { url } = options;
  return async (ctx, next) => {
    await next();
    if (ctx.url === '/') {
      let data;
      try {
        data = await fetchData(url);
        data = JSON.stringify(data);
      } catch (error) {
        data = `new Error('${error.message}')`;
      }
      ctx.body = ctx.body
        .toString()
        .replace('<!-- env:data -->', `<script>__DATA__ = ${data}</script>`);
    }
  };
}

module.exports = dataMiddleware;
