const fs = require('fs');
const path = require('path');
const Router = require('koa-router');
const api = require('../api');

const router = new Router();

function checkFileExists(file_path) {
  return fs.promises.access(file_path, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false);
}

async function cacheFile(stream, file_dir, file_name) {
  if (!await checkFileExists(file_dir)) {
    await fs.promises.mkdir(file_dir, { recursive: true });
  }

  const file_path = path.join(file_dir, file_name);

  if (!await checkFileExists(file_path)) {
    const writer = fs.createWriteStream(path.join(file_dir, file_name));
    stream.pipe(writer);
  
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  }

  return file_path;
}

router.get('/mesh/:scene_id/:file_name', async (ctx) => {
  const { scene_id, file_name } = ctx.params;

  const rsp = await api.get(`/apps/resource/mesh/${scene_id}/${file_name}`, { responseType: 'stream' });

  const root_dir = path.join(__dirname, '..', 'static/resource/mesh', scene_id);
  const file_path = await cacheFile(rsp.data, root_dir, file_name);

  ctx.body = fs.createReadStream(file_path);
});

router.get('/object/:scene_id/:file_name', async (ctx) => {
  const { scene_id, file_name } = ctx.params;

  const rsp = await api.get(`/apps/resource/object/${scene_id}/${file_name}`, { responseType: 'stream' });

  const root_dir = path.join(__dirname, '..', 'static/resource/object', scene_id);
  const file_path = await cacheFile(rsp.data, root_dir, file_name);

  ctx.body = fs.createReadStream(file_path);
});

router.get('/pose/:scene_id', async (ctx) => {
  const { scene_id } = ctx.params;

  const rsp = await api.get(`/apps/resource/pose/${scene_id}`, { responseType: 'stream' });

  const root_dir = path.join(__dirname, '..', 'static/resource/pose');
  const file_path = await cacheFile(rsp.data, root_dir, scene_id);

  ctx.body = fs.createReadStream(file_path);
});

router.get('/gallery/:scene_id', async (ctx) => {
  const { scene_id } = ctx.params;

  const rsp = await api.get(`/apps/resource/gallery/${scene_id}`, { responseType: 'stream' });

  const root_dir = path.join(__dirname, '..', 'static/resource/gallery');
  const file_path = await cacheFile(rsp.data, root_dir, scene_id);

  ctx.body = fs.createReadStream(file_path);
});

router.get('/preview/:scene_id', async (ctx) => {
  const { scene_id } = ctx.params;

  const rsp = await api.get(`/apps/resource/preview/${scene_id}`, { responseType: 'stream' });

  const root_dir = path.join(__dirname, '..', 'static/resource/preview');
  const file_path = await cacheFile(rsp.data, root_dir, scene_id);

  ctx.body = fs.createReadStream(file_path);
});

router.get('/refresh', async (ctx) => {
  const rsp = await api.get(`/apps/resource/refresh`, { responseType: 'stream' });

  const root_dir = path.join(__dirname, '..', 'static/resource');
  const file_path = await cacheFile(rsp.data, root_dir, 'refresh');

  ctx.body = fs.createReadStream(file_path);
});

module.exports = router;
