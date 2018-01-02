require('./db');
const Koa = require('koa');
const views = require('koa-views');
const path = require('path');
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const router = require('./router');
const resformat = require('./middlewares/resformat');

const app = new Koa();
const port = process.env.PORT || 8080;

const server = require('http').createServer(app.callback());
const io = require('socket.io')(server);

app.use(logger());
app.use(bodyParser());

app.use(serve(path.join(__dirname, '../')));

app.use(
  views(path.join(__dirname, '../'), {
    extension: 'html'
  })
);

app.use(resformat('^/api'));

app.use(router.routes()).use(router.allowedMethods());

app.use(async (ctx, next) => {
  if (ctx.url.indexOf('api') < 0) {
    await ctx.render('index.html');
  }
  next();
});

app.on('error', (err, ctx) => {
  console.log('server error', err, ctx);
});

// 加入線上人數計數
let onlineCount = 0;

// 修改 connection 事件
io.on('connection', socket => {
  // 有連線發生時增加人數
  onlineCount++;
  // 發送人數給網頁
  io.emit('online', onlineCount);

  socket.on('greet', () => {
    socket.emit('greet', onlineCount);
  });

  socket.on('disconnect', () => {
    // 有人離線了，扣人
    onlineCount = onlineCount < 0 ? 0 : (onlineCount -= 1);
    io.emit('online', onlineCount);
  });

  socket.on('send', msg => {
    io.emit('msg', msg);
  });
});

server.listen(port, () => {
  console.log(`started port on ${port}`);
});
