var Reflux = require('reflux');
var UserActions = require('../actions/UserActions')
var data = [];

var UserStore = Reflux.createStore({

  init: function() {
    console.log('UserStore initialized');
    this.data = {
    	userId : '',
		userName : '',
		userType : '',
		userState : '',
		isLogin : false,
    	hintMessage : ''
    };
    this.listenTo(UserActions.login, this.onLogin);
    this.listenTo(UserActions.register, this.onRegister);
    this.listenTo(UserActions.logout, this.onLogout);
  },

  onLogin: function(data) {
    	if(data.success == '1'){
    		this.setCurrentUser(data.userData);
    		this.trigger(this.data);
    	}else{
    		this.data.hintMessage = data.errMessage;
    		this.trigger(this.data);
    	}
    },
    onRegister:function(data){
    	if(data.success == '1'){
    		this.setCurrentUser(data.userData);
    		this.trigger(this.data);
    	}else{
    		this.data.hintMessage = data.errMessage;
    		this.trigger(this.data);
    	}
    },
    onLogout: function(payload){
    	this.setCurrentUser(null);
    	this.trigger(this.data);
    },

    setCurrentUser: function(userData){
    	if(!userData){
    		this.data.userId = '';
    		this.data.userName = '';
    		this.data.isLogin = false;
    		this.data.userType = '';
    		this.data.userState = '';
    	}else{
    		this.data.userId = userData.userId;
    		this.data.userName = userData.userName;
    		this.data.isLogin = true;
    		this.data.userType = userData.userType;
    		this.data.userState = userData.userState;
    	}
    }

});

module.exports = UserStore;
