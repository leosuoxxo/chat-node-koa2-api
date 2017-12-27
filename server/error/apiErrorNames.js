const ApiErrorNames = {};

ApiErrorNames.UNKNOW_ERROR = 'UNKNOW_ERROR';
ApiErrorNames.USER_NOT_EXIST = 'USER_NOT_EXIST';
ApiErrorNames.USER_IS_EXIST = 'USER_IS_EXIST';
ApiErrorNames.USER_WRONG_PASSWORD = 'USER_WRONG_PASSWORD';
ApiErrorNames.USER_NOT_LOGIN = 'USER_NOT_LOGIN';
/**
 * API错误名称对应的错误信息
 */
const error_map = new Map();

error_map.set(ApiErrorNames.UNKNOW_ERROR, { code: -1, message: '未知错误' });
error_map.set(ApiErrorNames.USER_NOT_EXIST, {
  code: 101,
  message: '用户不存在'
});
error_map.set(ApiErrorNames.USER_IS_EXIST, {
  code: 102,
  message: '用户已存在'
});
error_map.set(ApiErrorNames.USER_WRONG_PASSWORD, {
  code: 103,
  message: '密碼錯誤'
});
error_map.set(ApiErrorNames.USER_NOT_LOGIN, {
  code: 104,
  message: '請重新登入'
});
// 根据错误名称获取错误信息
ApiErrorNames.getErrorInfo = error_name => {
  let error_info;

  if (error_name) {
    error_info = error_map.get(error_name);
  }

  // 如果没有对应的错误信息，默认'未知错误'
  if (!error_info) {
    error_info = error_map.get('UNKNOW_ERROR');
  }

  return error_info;
};

module.exports = ApiErrorNames;
