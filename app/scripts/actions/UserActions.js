var Reflux = require('reflux');
var API = require('../api');

var UserActions = Reflux.createActions({
    'sendTelRegister' : {children:["success","failed"]},
	  'register' : {children:["success","failed"]},
	  'login' : {children:["success","failed"]},
	  'logout' : {children:["success"]},

});

/*
  id  string  Y 用户手机或邮箱号码
  password  string  Y 用户密码
  autologin boolean N 是否自动登陆
  autoexpires integer N 自动登陆过期时间，单位（分钟）
*/
UserActions.login.listen(function(data) {
  console.log("login begin");
  $.post(API.user_api.login_url, data).then(this.success, this.failed);
});

/*
  发送注册手机号码
  request : 
  {tel : string}
  response:
  {
    Result: true,    //信息是否发送成功
    ErrorCode: 0，    //错误代码
    ErrorMsg: null    //错误信息
}
*/
UserActions.sendTelRegister.listen(function(data) {
  console.log("send request code.");
  $.post(API.user_api.sendTelRegister_url, data).then(this.success, this.failed);
});

/*
  用户注册
  data:｛tel,code,password｝
  {
      Result: true,    //是否通过验证并注册成功
      ErrorCode: 0,    //错误代码
      ErrorMsg: null    //错误信息
  }
*/
UserActions.register.listen(function(data) {
  $.post(API.user_api.register_url, data).then(this.success, this.failed);
});

/*
  用户登出
*/
UserActions.logout.listen(function(data) {
    console.log('begin to logout!');
    this.success();
});



module.exports = UserActions;
