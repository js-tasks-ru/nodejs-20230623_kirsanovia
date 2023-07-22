const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

const subscribers = new Set();
const messages = [];

router.get('/all', async (ctx, next) => {
  ctx.body = messages;
});

router.get('/subscribe', async (ctx, next) => {
  const message = await new Promise((resolve) => {
    subscribers.add(resolve);
  });

  ctx.body = message;
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;
  if (!message) ctx.throw(400, 'required field `message` is missing');

  subscribers.forEach((resolve) => {
    resolve(message);
  });

  messages.push(message);
  subscribers.clear();

  ctx.body = message;
});

app.use(router.routes());

module.exports = app;
