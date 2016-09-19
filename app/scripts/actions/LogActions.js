var Reflux = require('reflux');
var HttpFactory = require('util/HttpFactory');
var API = require('util/api');


var LogActions = Reflux.createActions({
  'log' : {children:["success","failed"]},
});

LogActions.log.listen(function(data) {
  // HttpFactory.post(API.LOG.log,data,this.success,this.failed);
});

module.exports = LogActions;
