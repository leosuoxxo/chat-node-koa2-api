require('./db');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const router = require('./router');
const resformat = require('./middlewares/resformat');

const app = new Koa();
const port = process.env.PORT || 8080;

app.use(logger());
app.use(bodyParser());

app.use(resformat('^/api'));

app.use(router.routes()).use(router.allowedMethods());

app.on('error', (err, ctx) => {
  console.log('server error', err, ctx);
});

app.listen(port, () => {
  console.log(`started port on ${port}`);
});
