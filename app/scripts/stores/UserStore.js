var Reflux = require('reflux');
var UserActions = require('../actions/UserActions')
var data = [];

var UserStore = Reflux.createStore({

  init: function() {
    console.log('UserStore initialized');

    /*
        需要增加从localStorage读取用户信息的方法来初始化userData
    */
    this.userData = {
      userId: '',
      userName: '',
      userType: '',
      userState: '',
      isLogin: false,
      hintMessage: ''
    };
    /*
        可以用下面代码代替
        listenables: UserActions，

    */
    this.listenTo(UserActions.login.success, this.onLoginSuccess);
    this.listenTo(UserActions.login.failed, this.onLoginFailed);
    this.listenTo(UserActions.register.success, this.onRegisterSuccess);
    this.listenTo(UserActions.register.failed, this.onRegisterFailed);
    this.listenTo(UserActions.logout.success, this.onLogoutSuccess);
  },

  onLoginSuccess: function(data) {
    console.log('login get data:' + data);
    data = eval("(" + data + ")");
    if (data.success == '1') {
      this.setCurrentUser(data.data);
      this.trigger(this.userData);
    } else {
      this.userData.hintMessage = data.errMessage;
      this.trigger(this.userData);
    }
  },
  /*
    onLoginFailed 主要监听网络访问错误
  */
  onLoginFailed: function(data) {
      this.userData.hintMessage = data;
      this.trigger(this.userData);
  },
  /*
    监听注册action，根据返回的data.success判断是否注册成功
  */
  onRegisterSuccess: function(data) {
    if (data.success == '1') {
      this.setCurrentUser(data.data);
      this.trigger(this.userData);
    } else {
      this.userData.hintMessage = data.errMessage;
      this.trigger(this.userData);
    }
  },
  /*
    onRegisterFailed 主要监听网络访问错误
  */
  onRegisterFailed: function(data) {
      this.userData.hintMessage = data;
      this.trigger(this.userData);
  },
  /*
    登出后清空userData的用户信息
  */
  onLogoutSuccess: function(payload) {
    this.setCurrentUser(null);
    this.trigger(this.userData);
  },
  /*
    设定当前用户信息
  */
  setCurrentUser: function(userData) {
    if (!userData) {
      this.userData.userId = '';
      this.userData.userName = '';
      this.userData.isLogin = false;
      this.userData.userType = '';
      this.userData.userState = '';
    } else {
      this.userData.userId = userData.userId;
      this.userData.userName = userData.userName;
      this.userData.isLogin = true;
      this.userData.userType = userData.userType;
      this.userData.userState = userData.userState;
    }
  }

});

module.exports = UserStore;
