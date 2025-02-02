import { injectData } from '../../utils/data';

export default function dataMiddleware() {
  return async (ctx, next) => {
    await next();
    if (ctx.url === '/') {
      ctx.body = injectData(ctx.body.toString());
    }
  };
}
