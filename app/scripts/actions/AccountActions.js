var Reflux = require('reflux');
var HttpFactory = require('../HttpFactory');
var API = require('../api');

var AccountActions = Reflux.createActions({
  'changeAvator' : {children:['success','failed']}
  
});

AccountActions.changeAvator.listen(function (data) {
  console.log('begin to changeAvator:'+ API.user_api.changeAvator);
  HttpFactory.post(API.user_api.changeAvator ,data,this.success,this.failed);
});

module.exports = AccountActions;
