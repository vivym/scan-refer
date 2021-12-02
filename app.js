const Koa = require('koa');
const serve = require('koa-static');
const mount = require('koa-mount');
const path = require('path');

const app = new Koa();

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

app.use(mount("/build", serve(path.join(__dirname, '/build'))));

app.use(mount("/css", serve(path.join(__dirname, '/css'))));

app.use(mount("/offline", serve(path.join(__dirname, '/offline'))));

app.use(mount("/apps/resource", serve(path.join(__dirname, '/apps/resource'))));

// app.use(async ctx => {
//   ctx.body = 'Hello World';
// });

app.listen(3000);
