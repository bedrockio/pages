// Injects environment variables into templates.
// Note that only public variables should be exposed!
import config from '@bedrockio/config';

const PUBLIC = {};

for (let [key, value] of Object.entries(config.getAll())) {
  if (!key.startsWith('SERVER')) {
    PUBLIC[key] = value;
  }
}

const GLOBAL = JSON.stringify({
  env: PUBLIC,
});

const ENV_REG = /(?:<!-- |{{)env:(\w+)(?: -->|}})/g;

export default function envMiddleware() {
  return async (ctx, next) => {
    await next();
    if (ctx.type === 'text/html' && ctx.body) {
      ctx.body = ctx.body.toString().replace(ENV_REG, (all, name) => {
        if (name === 'conf') {
          return `<script>global = ${GLOBAL};</script>`;
        } else {
          return PUBLIC[name] || '';
        }
      });
    }
  };
}
