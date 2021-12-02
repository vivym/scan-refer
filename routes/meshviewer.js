const Router = require('koa-router');
const qs = require('qs');
const api = require('../api');

const router = new Router();

router.get('/:params', async (ctx) => {
  if (await ctx.cashed()) return;
  
  const { scene_id } = qs.parse(ctx.params.params);

  const rsp = await api.get(`/apps/meshviewer/${qs.stringify({ username: '{0}', scene_id })}`);

  ctx.body = rsp.data;
});

module.exports = router;
