var Reflux = require('reflux');
var PAuthActions = require('../actions/PAuthActions');
var data = [];

var PAuthStore = Reflux.createStore({

  init: function() {
    console.log('PAuthStore initialized');
    this.listenTo(PAuthActions.submitAudit.success,this.onSubmitAudit);
    this.listenTo(PAuthActions.submitAudit.failed,this.onFailed);
    this.listenTo(PAuthActions.viewAudit.success,this.onViewAudit);
    this.listenTo(PAuthActions.viewAudit.failed,this.onFailed);
  },
  onSubmitAudit : function(data){
    if(data.Success){
      console.log('submit audit success');
      console.log(data);
    }else{
      console.log('submit audit failed');
      console.log(data);
    }
  },
  onViewAudit : function(data){

  },
  onFailed : function(data){
    console.log('网络出错了');
  }

});

module.exports = PAuthStore;
