var Reflux = require('reflux');

var GetCodeActions = require('../actions/GetCodeActions');
var data = [];

/*
  获取验证码store
*/
var GetCodeStore = Reflux.createStore({

  init: function() {
    console.log('GetCodeStore initialized');
    //记录发送验证码的时间
    this.getCode = {
      left : 0,
      result : ''
    }
    this.listenTo(GetCodeActions.sendTelRegister.success,this.onTelRegisterSucess);
    this.listenTo(GetCodeActions.sendTelRegister,this.onBeginTelRegister);
  },
  onBeginTelRegister : function(){
    this.getCode.left = 60;
    countLeft = function(){
      this.getCode.left = this.getCode.left -1;
      this.trigger(this.getCode);
      setTimeout(countLeft, 1000);
    }.bind(this);
    countLeft();
  },
  onTelRegisterSucess : function(data){
    console.log(data);
    if(data.Success){
      this.getCode.result = '验证码已发送';
    }else{
      this.getCode.result = '验证码发送失败';
      this.getCode.left = 0;
    }
    this.trigger(this.getCode);
  },
});

module.exports = GetCodeStore;
