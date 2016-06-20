var Reflux = require('reflux');
var HttpFactory = require('../HttpFactory');
var API = require('../api');


var LogActions = Reflux.createActions({
  'log' : {children:["success","failed"]},
});

LogActions.log.listen(function(data) {
  // console.log("send log.");
  // HttpFactory.post(API.LOG.log,data,this.success,this.failed);
});

module.exports = LogActions;
