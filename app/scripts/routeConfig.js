/**
 * This is the config file for storing route path variables.
 *
 * @since 2016-06-13
**/
modules.export = {
  /* Root */
  // ROUTE_ROOT: '/', // 根目录
  ROUTE_LOGIN: '/login', // 登录
  ROUTE_REGISTER: '/register', // 注册
  ROUTE_PROVISION: '/provision', // 条款
  /* Account */
  ROUTE_ACCOUNT_INFO: '/account/info', // 账户信息（修改）
  ROUTE_ACCOUNT_PHOTOGRAPHER: '/account/p', // 摄影师专业信息（修改）
  ROUTE_ACCOUNT_MAKEUPARTIST: '/account/a', // 化妆师专业信息（修改）
  ROUTE_ACCOUNT_MOTE: '/account/m', // 模特专业信息（修改）
  ROUTE_ACCOUNT_PASSWORD: '/account/password', // 修改密码
  /* Auth */
  ROUTE_AUTH_SUMMARY: '/auth/', // 认证总览
  ROUTE_AUTH_BASIC: '/auth/basic', // 认证-基本信息填写
  ROUTE_AUTH_REALNAME: '/auth/realname', // 认证-实名认证
  ROUTE_AUTH_PHOTOGRAPHER: '/auth/p', // 认证-摄影师
  ROUTE_AUTH_MAKEUPARTIST: '/auth/a', // 认证-化妆师
  ROUTE_AUTH_MOTE: '/auth/m', // 认证-模特
  ROUTE_AUTH_RESULT: '/auth/result', // 认证-结果
  /* Album */
  ROUTE_ALBUM_UPLOAD: '/album/upload', // 作品上传
  ROUTE_ALBUM_DETAIL: '/album/detail', // 作品详情
  /* Order */
  ROUTE_ORDER: '/order', // TODO: 订单

};
