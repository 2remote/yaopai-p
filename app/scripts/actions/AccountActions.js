var Reflux = require('reflux');
var HttpFactory = require('../HttpFactory');
var API = require('../api');

var AccountActions = Reflux.createActions({
  'changeAvatar' : {children:['success','failed']}
  
});

AccountActions.changeAvatar.listen(function (data) {
  console.log('begin to changeAvatar:'+ API.user_api.changeAvatar);
  HttpFactory.post(API.user_api.changeAvatr ,data,this.success,this.failed);
});

module.exports = AccountActions;
