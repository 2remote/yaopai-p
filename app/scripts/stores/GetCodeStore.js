var Reflux = require('reflux');

var GetCodeActions = require('../actions/GetCodeActions');
var data = [];

/*
  获取验证码store
*/
var GetCodeStore = Reflux.createStore({

  init: function() {
    //记录发送验证码的时间
    this.getCode = {
      timeID : null,
      left : 0,
      result : ''
    }
    this.listenTo(GetCodeActions.sendTelRegister,this.onBeginTelRegister);
    this.listenTo(GetCodeActions.sendTelRegister.success,this.onTelRegisterSucess);
    this.listenTo(GetCodeActions.sendTelRegister2,this.onBeginTelRegister);
    this.listenTo(GetCodeActions.sendTelRegister2.success,this.onTelRegister2Success);

    //this.listenTo(GetCodeActions.sendEmailRegister,this.onBeginEmailRegister);
    this.listenTo(GetCodeActions.sendEmailRegister.success,this.onEmailRegisterSuccess);
    this.listenTo(GetCodeActions.sendTelResetPassWord,this.onBeginTelRegister);
    this.listenTo(GetCodeActions.sendTelResetPassWord.success,this.onSendTelResetSuccess);
    this.listenTo(GetCodeActions.sendMailResetPassWord,this.onBeginTelRegister);
    this.listenTo(GetCodeActions.sendMailResetPassWord.success,this.onSendMailResetSuccess);
    //this.listenTo(GetCodeActions.sendEmailRegister2,this.onBeginEmailRegister);
    //this.listenTo(GetCodeActions.sendEmailRegister2.success,this.onEmailRegisterSuccess);
  },

  onSendTelResetSuccess : function(data){
    if(data.Success){
      //this.getCode.result = '验证码已发送';
    }else{
      clearTimeout(this.timeID)
      this.timeID = null
      if(data.ErrorCode == '205002'){
        this.getCode.result = '该手机号未注册过本站'
        this.getCode.left = 0
      }else{
        this.getCode.result = '验证码发送失败'
        this.getCode.left = 0
      }
    }
    this.trigger(this.getCode)
  },


  onSendMailResetSuccess : function(data){
    if(data.Success){
      //this.getCode.result = '验证码已发送';
    }else{
      clearTimeout(this.timeID)
      this.timeID = null;
      if(data.ErrorCode == '205002'){
        this.getCode.result = '该邮箱未注册过本站'
        this.getCode.left = 0
      }else{
        this.getCode.result = '验证码发送失败'
        this.getCode.left = 0
      }
    }
    this.trigger(this.getCode)
  },

  onBeginTelRegister : function(){
    this.getCode.left = 60;
    var countLeft = function(){
      this.getCode.left = this.getCode.left -1;
      this.trigger(this.getCode);
      this.timeID = setTimeout(countLeft, 1000);
    }.bind(this)
    countLeft()
  },
  onBeginEmailRegister : function(data){
    console.log(data);
    this.getCode.left = 60;
    var countLeft = function(){
      this.getCode.left = this.getCode.left -1;
      this.trigger(this.getCode);
      this.timeID = setTimeout(countLeft, 1000);
    }.bind(this);
    countLeft();
  },
  onTelRegisterSucess : function(data){
    if(data.Success){
      //this.getCode.result = '验证码已发送';
    }else{
      clearTimeout(this.timeID)
      this.timeID = null;
      if(data.ErrorCode == '200002'){
        this.getCode.result = '该手机号已注册可直接登录';
        this.getCode.left = 0;
      }else{
        this.getCode.result = '验证码发送失败';
        this.getCode.left = 0;
      }
    }
    this.trigger(this.getCode);
  },
  onEmailRegisterSuccess : function(data){
    if(data.Success){
      alert('验证码已经发送,请查看邮箱消息');
      this.getCode.left = 60;
      var countLeft = function(){
        this.getCode.left = this.getCode.left -1;
        this.trigger(this.getCode);
        this.timeID = setTimeout(countLeft, 1000);
      }.bind(this);
      countLeft();
    }else{
      clearTimeout(this.timeID)
      this.timeID = null;
      if(data.ErrorCode == '200007'){
        this.getCode.result = '该邮箱已注册可直接登录';
        this.getCode.left = 0;
      }
      if(data.ErrorCode == '500001'){
        this.getCode.result = '发送时间间隔太短,请等候...';
        this.getCode.left = 0;
      }else{
        this.getCode.result = '验证码发送失败';
        this.getCode.left = 0;
      }
    }
    this.trigger(this.getCode);
  },
  onTelRegister2Success : function(data){
    if(data.Success){
      //this.getCode.result = '验证码已发送';
    }else{
      clearTimeout(this.timeID)
      this.timeID = null;
      if(data.ErrorCode == '200002'){
        this.getCode.result = '该手机号已注册可直接登录';
        this.getCode.left = 0;
      }else if(data.ErrorMsg == '验证码错误'){
        this.getCode.result = '图片验证码错误';
        this.getCode.left = 0;
      }else{
        this.getCode.result = '验证码发送失败';
        this.getCode.left = 0;
      }
    }
    this.trigger(this.getCode);
  },
});

module.exports = GetCodeStore;
