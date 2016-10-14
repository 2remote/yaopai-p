var Reflux = require('reflux');
var UserActions = require('../actions/UserActions');
var AccountActions = require('../actions/AccountActions');

var UserStore = Reflux.createStore({
  userKey : 'yaopai_user',
  init: function() {
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
      hintMessage: '',
      flag : '',
      loginDate : '',
      sessionToken : '',
    };
    /*
      获取第三方登录的返回值，并得到当前用户
    */
    UserActions.currentUser();
    /*
        可以用下面代码代替
        listenables: UserActions，

    */
    this.listenTo(UserActions.login.success, this.onLoginSuccess);
    this.listenTo(UserActions.login.failed, this.onLoginFailed);

    this.listenTo(UserActions.receiveTelResetPassWord.success, this.onReceiveTelResetSuccess);
    this.listenTo(UserActions.receiveTelResetPassWord.failed, this.onReceiveTelResetFailed);
    this.listenTo(UserActions.receiveMailResetPassWord.success, this.onReceiveMailResetSuccess);
    this.listenTo(UserActions.receiveMailResetPassWord.failed, this.onReceiveMailResetFailed);

    this.listenTo(UserActions.register.success, this.onRegisterSuccess);
    this.listenTo(UserActions.register.failed, this.onRegisterFailed);
    this.listenTo(UserActions.emailRegister.success, this.onEmailRegisterSuccess);
    this.listenTo(UserActions.emailRegister.failed, this.onEmailRegisterFailed);
    this.listenTo(UserActions.logout.success, this.onLogoutSuccess);
    this.listenTo(UserActions.loginWithToken.success,this.onLoginWithTokenSuccess);
    this.listenTo(UserActions.loginWithToken.failed,this.onLoginWithTokenFailed);
    this.listenTo(UserActions.currentServerUser.success,this.onGetCurrentUser);
    this.listenTo(UserActions.currentServerUser.failed,this.onGetCurrentUserFailed);
    this.listenTo(UserActions.currentUser,this.onCurrentUser);
    this.listenTo(UserActions.modifyPassword.success,this.onModifyPasswordSuccess);
    this.listenTo(UserActions.modifyPassword.failed,this.onModifyPasswordFailed);
    this.listenTo(AccountActions.changeAvatar.success, this.updateUser);
    this.listenTo(AccountActions.updateInfo.success, this.updateUser);
  },

  onReceiveTelResetSuccess : function(data){
    if(data.Success){
      //this.userData.hintMessage = "密码修改成功";
    }else{
      this.userData.hintMessage = data.ErrorMsg;
    }
    this.trigger(this.userData);
  },

  onReceiveTelResetFailed : function(data){
    this.userData.hintMessage = "网络出错啦！";
    this.trigger(this.userData);
  },

  onReceiveMailResetSuccess : function(data){
    if(data.Success){
      //this.userData.hintMessage = "密码修改成功";
    }else{
      this.userData.hintMessage = data.ErrorMsg;
    }
    this.trigger(this.userData);
  },

  onReceiveMailResetFailed : function(data){
    this.userData.hintMessage = "网络出错啦！";
    this.trigger(this.userData);
  },
  getTokenToLogin: function() {
    //从localStorage读取UserData
    var temp = localStorage.getItem(this.userKey);
    if(temp){
      temp = eval('('+temp+')');
      if(temp.loginToken && temp.loginToken != ''){
        //得到loginToken，自动登录
        UserActions.loginWithToken({token : temp.loginToken});
      }else{
        this.setCurrentUser(null);
        this.trigger(this.userData);
      }
    }else{
      this.setCurrentUser(null);
      this.trigger(this.userData);
    }
  },
  onLoginSuccess: function(data) {
    //测试本地须转换JSON，集成测试后不需要
    //data = eval("(" + data + ")");
    if (data.Success) {
      //用户登录成功，需要获得用户信息
      this.setCurrentUser(data.User);
      this.userData.loginToken = data.LoginToken;
      localStorage.setItem(this.userKey,JSON.stringify(this.userData));
      this.userData.hintMessage = '';
    } else {
      this.userData.hintMessage = data.ErrorMsg;
    }
    this.userData.flag = "login";
    this.trigger(this.userData);
  },
  /*
    onLoginFailed 主要监听网络访问错误
  */
  onLoginFailed: function(data) {
      this.userData.hintMessage = "网络出错啦！";
      this.userData.flag = "login";
      this.trigger(this.userData);
  },
  /*
    避免重复读取服务器api
  */
  onCurrentUser: function() {
    var now = new Date();
    var loginDate = this.userData.loginDate;
    if(this.userData.isLogin && this.userData.loginDate){
      if(typeof loginDate == 'string'){
        loginDate = StringToDate(loginDate);
      }
      if(parseInt((now - loginDate)/60000) < 10){
        //小于十分钟之内的登录，不再向服务器请求当前用户
        this.userData.flag = 'currentUser';
        return this.trigger(this.userData);
      }else{
        return UserActions.currentServerUser();
      }
    }
    UserActions.currentServerUser();
  },
  onGetCurrentUser: function(data) {
    if(data.Success){
      this.setCurrentUser(data);
      this.userData.flag = 'currentUser';
      this.trigger(this.userData);
    }else{
      //若未得到当前用户，尝试loginwithtoken
      this.getTokenToLogin();
    }
  },
  onGetCurrentUserFailed: function(data) {
    this.userData.hintMessage = '网络出错啦！';
    this.userData.flag = 'currentUser';
    this.trigger(this.userData);
  },
  /*
    自动登录，如果用了loginToken，是否不用存user的其他信息？
  */
  onLoginWithTokenSuccess: function(data) {
    if(data.Success){
      this.setCurrentUser(data.User);
      this.userData.loginToken = data.LoginToken;
      localStorage.setItem(this.userKey,JSON.stringify(this.userData));
    }else{
      this.setCurrentUser(null);
      this.userData.LoginToken = '';
      localStorage.removeItem(this.userKey);
    }
    this.userData.flag = "loginToken";
    this.trigger(this.userData);

  },
  onLoginWithTokenFailed: function(data) {
    this.userData.hintMessage = '网络出错啦！';
    this.userData.flag = 'loginToken';
    this.trigger(this.userData);
  },
  /*
    监听注册action，根据返回的data.success判断是否注册成功
  */
  onRegisterSuccess: function(data) {
    if (data.Success) {
      this.userData.hintMessage = '';
      this.setCurrentUser(data.User);
    } else {
      this.userData.hintMessage = data.ErrorMsg;
    }
    this.userData.flag = "register";
    this.trigger(this.userData);
  },
  /*
    onRegisterFailed 主要监听网络访问错误
  */
  onRegisterFailed: function(data) {
      this.userData.hintMessage = '网络出错啦！';
      this.userData.flag = "register"
      this.trigger(this.userData);
  },
  /*
   监听注册action，根据返回的data.success判断是否注册成功
   */
  onEmailRegisterSuccess: function(data) {
    if (data.Success) {
      this.userData.hintMessage = '';
      this.setCurrentUser(data.User);
    } else {
      this.userData.hintMessage = data.ErrorMsg;
    }
    this.userData.flag = "register";
    this.trigger(this.userData);
  },
  /*
   onRegisterFailed 主要监听网络访问错误
   */
  onEmailRegisterFailed: function(data) {
    this.userData.hintMessage = '网络出错啦！';
    this.userData.flag = "register"
    this.trigger(this.userData);
  },
  /*
    登出后清空userData的用户信息
  */
  onLogoutSuccess: function() {
    this.setCurrentUser(null);
    localStorage.removeItem(this.userKey);
    this.userData.flag = "logout";
    this.trigger(this.userData);
  },

  /*
    用户修改密码,flag :  modifyPassword
  */
  onModifyPasswordSuccess: function(data) {
    if(data.Success){
      this.userData.hintMessage = "修改密码成功";
    }else{
      this.userData.hintMessage = data.ErrorMsg;
    }
    this.userData.flag="modifyPassword";
    this.trigger(this.userData);
  },
  onModifyPasswordFailed : function(data){
  },

  /*
    设定当前用户信息
  */
  setCurrentUser: function(userData) {
    if (!userData) {
      this.userData.userId = '';
      this.userData.userName = '';
      this.userData.local = true;
      this.userData.isLogin = false;
      this.userData.userType = '';
      this.userData.avatar = '';
      this.userData.signature = '';
      this.userData.provinceId = 0;
      this.userData.provinceName = '';
      this.userData.cityId = 0;
      this.userData.cityName = '';
      this.userData.countyId = 0;
      this.userData.countyName = '';
      this.userData.loginDate = '';
      this.userData.sessionToken = '';
      this.userData.gender = 0;
    } else {
      this.userData.userId = userData.Id;
      this.userData.userName = userData.Name;
      this.userData.userType = userData.Type;
      this.userData.avatar = userData.Avatar;
      this.userData.signature = userData.Signature;
      this.userData.provinceId = userData.ProvinceId;
      this.userData.provinceName = userData.ProvinceName||'-';
      this.userData.cityId = userData.CityId;
      this.userData.cityName = userData.CityName||'-';
      this.userData.countyId = userData.CountyId;
      this.userData.countyName = userData.CountyName||'-';
      this.userData.local = userData.Local;
      this.userData.isLogin = true;
      this.userData.loginDate = new Date();
      this.userData.sessionToken = userData.SessionToken;
      this.userData.gender = userData.Sex;
    }
  },
  /**
   * 更新当前用户的信息，用于解决AccountAction更新数据后这边不同步的情况。
   * 此方法为临时解决方案，日后会重构UserStore和AccountStore
  **/
  updateUser: function(respData, data) {
    var loadedData = {};
    /* converts data to this.userData style */
    if(data.Avatar) {
      loadedData.avatar = data.Avatar;
    }
    if(data.ProvinceId || data.ProvinceId === 0) {
      loadedData.provinceId = data.ProvinceId;
    }
    if(data.CityId || data.CityId === 0) {
      loadedData.cityId = data.CityId;
    }
    if(data.CountyId || data.CountyId === 0) {
      loadedData.countyId = data.CountyId;
    }
    if(data.NickName) {
      loadedData.userName = data.NickName;
    }
    if(respData.Success) { // then merge
      this.userData = Object.assign({}, this.userData, loadedData);
      this.trigger(this.userData);
    }
  },
});

module.exports = UserStore;
