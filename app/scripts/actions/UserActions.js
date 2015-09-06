require('../api.js')
var Reflux = require('reflux');
var UserActions = Reflux.createActions({
	  'register' : {children:["success","failed"]},
	  'login' : {children:["success","failed"]},
	  'logout' : {children:["success"]}
});

UserActions.login.listen(function(data) {
    $.post(API_CONST.user_apid.login_url, data).then(this.success, this.failed);
});

UserActions.register.listen(function(data) {
    $.post(API_CONST.user_apid.register_url, data).then(this.success, this.failed);
});

UserActions.logout.listen(function(data) {
    this.success();
});



module.exports = UserActions;
