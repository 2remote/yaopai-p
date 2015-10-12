var Reflux = require('reflux');
var PAuthActions = require('../actions/PAuthActions');

var PAuthStore = Reflux.createStore({
  data : {
    pAuth : {},
    hitMessage : '',
    flag : '',
  },
  init: function() {
    console.log('PAuthStore initialized');
    this.listenTo(PAuthActions.submitAudit.success,this.onSubmitAudit);
    this.listenTo(PAuthActions.submitAudit.failed,this.onFailed);
    this.listenTo(PAuthActions.viewAudit.success,this.onViewAudit);
    this.listenTo(PAuthActions.viewAudit.failed,this.onFailed);
  },
  onSubmitAudit : function(data){
    if(data.Success){
      this.data.hintMessage = null;
    }else{
      this.data.hintMessage = data.ErrorMsg;
    }
    this.data.flag = 'submitAudit';
    this.trigger(this.data);
  },
  onViewAudit : function(data){
    console.log(data);
    if(data.Success){
      this.data.pAuth = data;
      this.data.hitMessage = null;
    }else{
      this.data.hitMessage = data.ErrorMsg;
    }
    this.data.flag = 'viewAudit';
    this.trigger(this.data);
  },
  onFailed : function(data){
    console.log('网络出错了');
  }

});

module.exports = PAuthStore;
