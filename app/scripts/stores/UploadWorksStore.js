var Reflux = require('reflux');
var UploadWorksActions = require('../actions/UploadWorksActions');

var UploadWorksStore = Reflux.createStore({
  data : {
    flag : '',
    hintMessage : '',
    workData : {}
  }
  init: function() {
    console.log('UploadWorksStore initialized');
    this.listenTo(UploadWorksActions.add.success,this.onAddSuccess);
    this.listenTo(UploadWorksActions.add.failed,this.onFailed);
    this.listenTo(UploadWorksActions.get.success,this.onGetSuccess);
    this.listenTo(UploadWorksActions.get.failed,this.onFailed);
    this.listenTo(UploadWorksActions.update.success,this.onUpdateSuccess);
    this.listenTo(UploadWorksActions.update.failed,this.onFailed);
    this.listenTo(UploadWorksActions.delete.success,this.onDeleteSuccess);
    this.listenTo(UploadWorksActions.delete.failed,this.onFailed);
    this.listenTo(UploadWorksActions.search.success,this.onSearchSuccess);
    this.listenTo(UploadWorksActions.search.failed,this.onFailed);
  },
  onFailed : function(res){
    this.data.hintMessage = '网络错误';
    this.data.flag == 'failed';
    this.trigger(this.data);
  },
  onAddSuccess : function(res){
    if(res.Success){
      this.data.hintMessage = '';
    }else{
      this.data.hintMessage = res.ErrorMsg;
    }
    this.data.flag = 'add';
    this.trigger(this.data);
  },
  onGetSuccess : function(res){
    if(res.Success){
      this.data.workData = res;
    }else{
      this.data.workData = null;
    }
    this.data.flag = 'get';
    this.trigger(this.data);
  },
  onUpdateSuccess : function(res){
    if(res.Success){
      this.data.hintMessage = '';
    }else{
      this.data.hintMessage = res.ErrorMsg;
    }
    this.data.flag = 'update';
    this.trigger(this.data);
  },
  onDeleteSuccess : function(res){
    if(res.Success){
      this.data.hintMessage = '';
    }else{
      this.data.hintMessage = res.ErrorMsg;
    }
    this.data.flag = 'delete';
    this.trigger(this.data);
  },
  onSearchSuccess : function(res){
    //暂时不做
  },

});

module.exports = UploadWorksStore;
