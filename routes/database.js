const Router = require('koa-router');
const api = require('../api');

const router = new Router();

router.get('/meshselect/query/:scene_id', async (ctx) => {
  if (await ctx.cashed()) return;

  const { scene_id } = ctx.params;

  const rsp = await api.get(`/apps/database/meshselect/query/${scene_id}`);

  ctx.body = rsp.data;
});

router.get('/mesh2cap/query/:scene_id/:id1/:id2', async (ctx) => {
  if (await ctx.cashed()) return;

  const { scene_id, id1, id2 } = ctx.params;

  const rsp = await api.get(`/apps/database/mesh2cap/query/${scene_id}/${id1}/${id2}`);

  ctx.body = rsp.data;
});

module.exports = router;
