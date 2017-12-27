const router = require('koa-router')();
const userctrl = require('../controllers/UserController');

router
  .post('/api/login', userctrl.login)
  .post('/api/register', userctrl.register)
  .get('/api/checkLogin', userctrl.checkLogin)
  .get('/api/logout', userctrl.logout);
module.exports = router;
