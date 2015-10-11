var Reflux = require('reflux');
var AccountActions = require('../actions/AccountActions');
var data = [];

var AccountStore = Reflux.createStore({
  accountData : {},
  init: function() {
    console.log('AccountStore initialized');
    this.accountData = {
      avator : '',
      hintMessage : '',
      flag : '',
    };
    this.listenTo(AccountActions.changeAvatar.success,this.onChangeAvatarSuccess);
    this.listenTo(AccountActions.changeAvatar.failed,this.onChangeAvatarFailed);
    this.listenTo(AccountActions.updateInfo.success,this.onUpdateInfoSuccess);
    this.listenTo(AccountActions.updateInfo.failed,this.onUpateInfoFailed);
    this.listenTo(AccountActions.userDetail.success,this.onGetUserDetailSuccess);
    this.listenTo(AccountActions.userDetail.failed,this.onGetUserDetailFailed);
  },

  onChangeAvatarSuccess : function(data){
    if(data.Success){
      this.accountData.hintMessage = '用户头秀修改成功！';
    }else{
      this.accountData.hintMessage = data.ErrorMsg;
    }
    this.accountData.flag = 'avator';
    this.trigger(this.accountData);
  },
  onChangeAvatarFailed : function(data){
    this.accountData.hintMessage = '网络错误，请重试！';
    this.accountData.flag= "avator";
    this.trigger(this.accountData);
  },

  onUpdateInfoSuccess : function(data){
    if(data.Success){
      this.accountData.hintMessage = '用户信息修改成功！'
    }else{
      this.accountData.hintMessage = data.ErrorMsg;
    }
    this.accountData.flag = 'updateInfo';
    this.trigger(this.accountData);
  },
  onUpateInfoFailed : function(data){
    this.accountData.hintMessage = '网络错误，请重试！';
    this.accountData.flag = 'updateInfo';
    this.trigger(this.accountData);
  },
  onGetUserDetailSuccess : function(data){
    if(data.Success){
      this.accountData.detail = data;
    }else{
      this.accountData.detail = null;
      this.accountData.hintMessage = data.ErrorMsg;
    }
    this.accountData.flag = 'userDetail';
    this.trigger(this.accountData);
  },
  onGetUserDetailFailed : function(data){
    console.log(data);
    this.accountData.hintMessage = '网络错误，请重试！';
    this.accountData.flag = 'userDetail';
    this.trigger(this.accountData);
  },
});

module.exports = AccountStore;
