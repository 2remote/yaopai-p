var Reflux = require('reflux');
var PAuthActions = require('../actions/PAuthActions');

var PAuthStore = Reflux.createStore({
  data : {
    pAuth : {},
    photographer : {},
    studio : {},
    hitMessage : '',
    flag : '',
  },
  init: function() {
    console.log('PAuthStore initialized');
    this.listenTo(PAuthActions.submitAudit.success,this.onSubmitAudit);
    this.listenTo(PAuthActions.submitAudit.failed,this.onFailed);
    this.listenTo(PAuthActions.viewAudit.success,this.onViewAudit);
    this.listenTo(PAuthActions.viewAudit.failed,this.onFailed);
    this.listenTo(PAuthActions.get.success,this.onGetSuccess);
    this.listenTo(PAuthActions.get.failed,this.onFailed);
    this.listenTo(PAuthActions.current.success,this.onCurrentSuccess);
    this.listenTo(PAuthActions.current.failed,this.onFailed);
    this.listenTo(PAuthActions.change.success,this.onChangeSuccess);
    this.listenTo(PAuthActions.change.failed,this.onFailed);
    this.listenTo(PAuthActions.currentStudio.success,this.onCurrentStudioSuccess);
    this.listenTo(PAuthActions.currentStudio.failed,this.onFailed);
    this.listenTo(PAuthActions.changeStudio.success,this.onChangeStuidioSuccess);
    this.listenTo(PAuthActions.changeStudio.failed,this.onFailed)
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
  onGetSuccess : function(res){
    if(res.Success){
      this.data.photographer = res;
      this.data.hintMessage = '';
    }else{
      this.data.hintMessage = res.ErrorMsg;
    }
    this.data.flag = 'get';
    this.trigger(this.data);
  },
  onCurrentSuccess : function(res){
    if(res.Success){
      this.data.photographer = res;
      this.data.hintMessage = '';
    }else{
      this.data.photographer = {};
      this.data.hintMessage = res.ErrorMsg;
      console.log('摄影师信息获取失败');
    }
    this.data.flag = 'current';
    this.trigger(this.data);
  },
  onChangeSuccess : function(res){
    if(res.Success){
      this.data.hintMessage = '';
    }else{
      this.data.hintMessage = res.ErrorMsg;
    }
    this.data.flag = 'chagne';
    this.trigger(this.data);
  },
  onCurrentStudioSuccess : function(res){
    if(res.Success){
      this.data.studio = res;
      this.data.hintMessage = '';
    }else{
      this.data.studio = {};
      this.data.hintMessage = res.ErrorMsg;
      console.log('工作室信息获取失败');
    }
    this.data.flag = 'currentStudio';
    this.trigger(this.data);
  },
  onChangeStuidioSuccess : function(res){
    if(res.Success){
      this.data.hintMessage = '';
    }else{
      this.data.hintMessage = res.ErrorMsg;
    }
    this.data.flag = 'changeStudio';
    this.trigger(this.data);
  },
  onFailed : function(data){
    console.log('网络出错了');
  }

});

module.exports = PAuthStore;
