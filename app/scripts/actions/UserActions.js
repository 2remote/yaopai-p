var Reflux = require('reflux');
var API = require('../api');

var UserActions = Reflux.createActions({
	  'register' : {children:["success","failed"]},
	  'login' : {children:["success","failed"]},
	  'logout' : {children:["success"]}
});

UserActions.login.listen(function(data) {
  console.log("login begin");
  $.post(API.user_api.login_url, data).then(this.success, this.failed);
});

UserActions.register.listen(function(data) {
  $.post(API.user_api.register_url, data).then(this.success, this.failed);
});

UserActions.logout.listen(function(data) {
    console.log('begin to logout!');
    this.success();
});



module.exports = UserActions;
