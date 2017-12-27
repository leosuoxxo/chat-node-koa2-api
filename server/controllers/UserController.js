const ApiError = require('../error/ApiError');
const ApiErrorNames = require('../error/ApiErrorNames');
const UserModel = require('../models/user');
const jwt = require('jsonwebtoken');

const secret = 'just talk';

class UserController {
  static async checkLogin(ctx) {
    const token = ctx.cookies.get('user-token');
    let payload;
    if (token) {
      payload = await jwt.verify(token, secret); // // 解密，获取payload
      ctx.body = {
        account: payload.account,
        nickname: payload.nickname,
        avatar: payload.avatar
      };
    } else {
      ctx.state.error = true;
      ctx.body = new ApiError(ApiErrorNames.USER_NOT_LOGIN);
    }
  }
  // 用户登入
  static async login(ctx) {
    const req = {
      account: ctx.request.body.account,
      password: ctx.request.body.password
    };
    await UserModel.findOne({ account: req.account }, (err, user) => {
      if (user || user.account) {
        if (user.password === req.password) {
          const token = jwt.sign(
            {
              account: user.account,
              nickname: user.nickname,
              avatar: user.avatar
            },
            secret,
            { expiresIn: Date.now() + 10 * 60 * 1000 }
          );
          ctx.body = {
            account: user.account,
            nickname: user.nickname,
            avatar: user.avatar
          };
          ctx.cookies.set('user-token', token, {
            domain: 'localhost', // 写cookie所在的域名
            path: '/', // 写cookie所在的路径
            maxAge: 10 * 60 * 1000, // cookie有效时长
            expires: Date.now() + 10 * 60 * 1000, // cookie失效时间
            httpOnly: false, // 是否只用于http请求中获取
            overwrite: false // 是否允许重写
          });
        } else {
          ctx.state.error = true;
          ctx.body = new ApiError(ApiErrorNames.USER_WRONG_PASSWORD);
        }
      } else {
        ctx.state.error = true;
        ctx.body = new ApiError(ApiErrorNames.USER_NOT_EXIST);
      }
    });
  }
  static async register(ctx) {
    const req = {
      account: ctx.request.body.account,
      password: ctx.request.body.password,
      nickname: ctx.request.body.nickname
    };
    const Checker = await UserModel.findOne(
      { $or: [{ account: req.account }, { nickname: req.nickname }] },
      async (err, checker) => {
        checker;
      }
    );
    if (Checker) {
      ctx.body = new ApiError(ApiErrorNames.USER_IS_EXIST);
      ctx.state.error = true;
    } else {
      const User = await new UserModel(req).save();
      await UserModel.findOne(User, (error, user) => {
        ctx.body = {
          id: user._id,
          account: user.account,
          nickname: user.nickname,
          avatar: user.avatar
        };
      });
    }
  }
  static async logout(ctx) {
    ctx.cookies.set('user-token', null);
  }
}

module.exports = UserController;
