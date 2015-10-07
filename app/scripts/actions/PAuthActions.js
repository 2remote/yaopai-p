var Reflux = require('reflux');
var HttpFactory = require('../HttpFactory');
var API = require('../api');

var PAuthActions = Reflux.createActions({
  'submitAudit' : {children:['success','failed']},
  'viewAudit' : {children : ['success','failed']}
});

PAuthActions.submitAudit.listen(function(data){
  HttpFactory.post(API.PHOTOGRAPHER.submitAudit,data,this.success,this.failed);
});

PAuthActions.viewAudit.listen(function(data){
  HttpFactory.post(API.PHOTOGRAPHER.viewAudit,data,this.success,this.failed);
});

module.exports = PAuthActions;
