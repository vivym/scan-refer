const path = require('path');
const Koa = require('koa');
const serve = require('koa-static');
const mount = require('koa-mount');
const Router = require('koa-router');
const views = require('koa-views');
const koaCash = require('koa-cash');
const Keyv = require('keyv');
const { KeyvFile } = require('keyv-file');

const mainRouter = require('./routes/main');
const viewerRouter = require('./routes/meshviewer');
const databaseRouter = require('./routes/database');
const resourceRouter = require('./routes/resource');

const app = new Koa();

app.use(views(path.join(__dirname, 'templates'), { extension: 'ejs' }));

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(mount("/build", serve(path.join(__dirname, 'static/build'), { maxage: 365 * 24 * 60 * 60 * 1000 })));

app.use(mount("/css", serve(path.join(__dirname, 'static/css'), { maxage: 365 * 24 * 60 * 60 * 1000 })));

app.use(mount("/offline", serve(path.join(__dirname, 'static/offline'), { maxage: 365 * 24 * 60 * 60 * 1000 })));

app.use(mount("/apps/resource", serve(path.join(__dirname, 'static/resource'), { maxage: 365 * 24 * 60 * 60 * 1000 })));

const keyv = new Keyv({
  store: new KeyvFile({
    filename: path.join(__dirname, 'static', 'resource', 'cache.json'),
    writeDelay: 100,
  }),
});
app.use(koaCash({
  get: (key) => {
    return keyv.get(key);
  },
  set(key, value) {
    keyv.set(key, value);
  },
}));

const router = new Router();
router
  .use('/apps/main', mainRouter.routes(), mainRouter.allowedMethods())
  .use('/apps/database', databaseRouter.routes(), databaseRouter.allowedMethods())
  .use('/apps/meshviewer', viewerRouter.routes(), viewerRouter.allowedMethods())
  .use('/apps/resource', resourceRouter.routes(), resourceRouter.allowedMethods());

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000);
