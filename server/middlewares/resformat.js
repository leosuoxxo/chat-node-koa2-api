const resformat = ctx => {
  if (ctx.body && !ctx.state.error) {
    ctx.body = {
      ok: true,
      msg: 'success',
      result: ctx.body
    };
  } else if (ctx.body && ctx.state.error) {
    ctx.body = {
      ok: false,
      msg: ctx.body.message
    };
  } else {
    ctx.body = {
      ok: true,
      msg: 'success'
    };
  }
};

const filter = pattern => async (ctx, next) => {
  const reg = new RegExp(pattern);
  try {
    ctx.state.error = false;
    await next();
  } catch (error) {
    console.log(error);
    // if (error instanceof ApiError && reg.test(ctx.originalUrl)) {
    //   ctx.status = 200;
    //   ctx.body = {
    //     code: error.code,
    //     message: error.message
    //   };
    // }
    throw error;
  }
  if (reg.test(ctx.originalUrl)) {
    resformat(ctx);
  }
};

module.exports = filter;
