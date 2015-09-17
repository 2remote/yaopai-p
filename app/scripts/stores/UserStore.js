var Reflux = require('reflux');
var UserActions = require('../actions/UserActions')
var data = [];

var UserStore = Reflux.createStore({
  userKey : 'yaopai_user',
  init: function() {
    console.log('UserStore initialized');

    /*
        需要增加从localStorage读取用户信息的方法来初始化userData
    */
    this.userData = {
      userId: '',
      userName: '',
      loginToken : '',//用户选择rememberme的时候返回
      userType: '',
      userState: '',
      isLogin: false,
      hintMessage: ''
    };

    var temp = localStorage.getItem(this.userKey);
    if(temp){
      this.userData = eval('('+temp+')');
    }
    
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
    console.log(data);
    //测试本地须转换JSON，集成测试后不需要
    //data = eval("(" + data + ")");
    if (data.Success) {
      //用户登录成功，需要获得用户信息
      this.setCurrentUser(data.User);
      localStorage.setItem(this.userKey,JSON.stringify(this.userData));
      this.trigger(this.userData);
    } else {
      this.userData.hintMessage = data.ErrorMsg;
      console.log(this.userData);
      this.trigger(this.userData);
    }
  },
  /*
    onLoginFailed 主要监听网络访问错误
  */
  onLoginFailed: function(data) {
      this.userData.hintMessage = "网络出错啦！";
      this.trigger(this.userData);
  },
  /*
    监听注册action，根据返回的data.success判断是否注册成功
  */
  onRegisterSuccess: function(data) {
    if (data.ErrorCode == 0) {
      this.setCurrentUser(data.data);
      this.trigger(this.userData);
    } else {
      this.userData.hintMessage = data.ErrorMsg;
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
  onLogoutSuccess: function() {
    this.setCurrentUser(null);
    localStorage.removeItem(this.userKey);
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
      this.userData.userId = userData.Id;
      this.userData.userName = userData.Name;
      this.userData.isLogin = true;
      // this.userData.userType = userData.userType;
      // this.userData.userState = userData.userState;
    }
  }

});

module.exports = UserStore;
