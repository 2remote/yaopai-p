var Reflux = require('reflux');
var HttpFactory = require('../HttpFactory');
var API = require('../api');


var GetCodeActions = Reflux.createActions({
  'sendTelRegister' : {children:["success","failed"]},
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
  console.log("send request code.");
  // $.post(API.user_api.sendTelRegister_url, data).then(this.success, this.failed);
  HttpFactory.post(API.user_api.sendTelRegister,data,this.success,this.failed);
  //this.success({Success : true});
});

module.exports = GetCodeActions;
