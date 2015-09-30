var Reflux = require('reflux');
var HttpFactory = require('../HttpFactory');
var API = require('../api');

var AccountActions = Reflux.createActions({
  'changeAvatar' : {children : ['success','failed']},
  'updateInfo' : {children : ['success','failed']}
});

AccountActions.changeAvatar.listen(function (data) {
  HttpFactory.post(API.user_api.changeAvatr ,data,this.success,this.failed);
});

AccountActions.updateInfo.listen(function(data){
  HttpFactory.post(API.user_api.updateInfo, data, this.success, this.failed);
})

module.exports = AccountActions;
