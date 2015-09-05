var Reflux = require('reflux');

var UserActions = Reflux.createAction({
	asyncResult: true,
	children:[
	  'register',
	  'login',
	  'logout'
	]
});

module.exports = UserActions;
