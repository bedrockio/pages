// Injects environment variables into templates.
// Note that only public variables should be exposed!
const config = require('@bedrockio/config');

const PUBLIC = {};

for (let [key, value] of Object.entries(config.getAll())) {
  if (!key.startsWith('SERVER')) {
    PUBLIC[key] = value;
  }
}

const ENV_REG = /(?:<!-- |{{)env:(\w+)(?: -->|}})/g;

module.exports = function envMiddleware() {
  const env = JSON.stringify(PUBLIC);
  return async (ctx, next) => {
    await next();
    if (ctx.type === 'text/html' && ctx.body) {
      ctx.body = ctx.body.toString().replace(ENV_REG, (all, name) => {
        if (name === 'conf') {
          return `<script>window.__ENV__ = ${env};</script>`;
        } else {
          return PUBLIC[name] || '';
        }
      });
    }
  };
};
