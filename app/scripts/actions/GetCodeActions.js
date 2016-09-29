var Reflux = require('reflux');
var HttpFactory = require('util/HttpFactory');
var API = require('util/api');


var GetCodeActions = Reflux.createActions({
  'sendTelRegister' : {children:["success","failed"]},
  'sendTelRegister2' : {children:["success","failed"]},//_SendTelRegister
  'sendEmailRegister' : {children:["success","failed"]},
  'sendEmailRegister2' : {children:["success","failed"]},
  'sendTelResetPassWord' : {children:["success","failed"]},
  'sendMailResetPassWord' : {children:["success","failed"]},
  // Here you can list your actions
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
GetCodeActions.sendTelRegister.listen(function(data) {
  HttpFactory.post(API.USER.sendTelRegister,data,this.success,this.failed);
});
/*
 发送注册手机号码   带图片验证码
 request :
 {tel : string,pin : string}
 response:
 {
 Result: true,    //信息是否发送成功
 ErrorCode: 0，    //错误代码
 ErrorMsg: null    //错误信息
 }
 */
GetCodeActions.sendTelRegister2.listen(function(data) {
  HttpFactory.post(API.USER.sendTelRegister2,data,this.success,this.failed);
});

/*
 发送注册邮箱
 request :
 {email : string}
 response:
 {
 Result: true,    //信息是否发送成功
 ErrorCode: 0，    //错误代码
 ErrorMsg: null    //错误信息
 }
 */
GetCodeActions.sendEmailRegister.listen(function(data) {
  HttpFactory.post(API.USER.sendEmailRegister,data,this.success,this.failed);
});

/*
 发送注册邮箱   带图片验证码
 request :
 {email : string,pin : string}
 response:
 {
 Result: true,    //信息是否发送成功
 ErrorCode: 0，    //错误代码
 ErrorMsg: null    //错误信息
 }
 */
GetCodeActions.sendEmailRegister2.listen(function(data) {
  HttpFactory.post(API.USER.sendEmailRegister2,data,this.success,this.failed);
});



/*
 发送手机重置密码信息
 request :
 {tel : string}
 response:
 {
 Result: true,    //信息是否发送成功
 ErrorCode: 0，    //错误代码
 ErrorMsg: null    //错误信息
 }
 */
GetCodeActions.sendTelResetPassWord.listen(function(data) {
  HttpFactory.post(API.USER.sendTelResetPassWord,data,this.success,this.failed)
})


/*
 发送邮箱重置密码信息
 request :
 {email : string}
 response:
 {
 Result: true,    //信息是否发送成功
 ErrorCode: 0，    //错误代码
 ErrorMsg: null    //错误信息
 }
 */
GetCodeActions.sendMailResetPassWord.listen(function(data) {
  HttpFactory.post(API.USER.sendMailResetPassWord,data,this.success,this.failed)
})


module.exports = GetCodeActions;
