var Reflux = require('reflux');
var AlbumsActions = require('../actions/AlbumsActions');

var AlbumsStore = Reflux.createStore({
  data : {
    flag : '',
    hintMessage : '',
    workData : {},
    categories : [],
    workList : [],
  },
  init: function() {
    console.log('UploadWorksStore initialized');
    this.listenTo(AlbumsActions.add.success,this.onAddSuccess);
    this.listenTo(AlbumsActions.add.failed,this.onFailed);
    this.listenTo(AlbumsActions.get.success,this.onGetSuccess);
    this.listenTo(AlbumsActions.get.failed,this.onFailed);
    this.listenTo(AlbumsActions.update.success,this.onUpdateSuccess);
    this.listenTo(AlbumsActions.update.failed,this.onFailed);
    this.listenTo(AlbumsActions.delete.success,this.onDeleteSuccess);
    this.listenTo(AlbumsActions.delete.failed,this.onFailed);
    this.listenTo(AlbumsActions.search.success,this.onSearchSuccess);
    this.listenTo(AlbumsActions.search.failed,this.onFailed);
    this.listenTo(AlbumsActions.getMyAlbums.success,this.onGetMyAlbumsSuccess);
    this.listenTo(AlbumsActions.getMyAlbums.failed,this.onFailed);
    this.listenTo(AlbumsActions.getCategories.success,this.onGetCategoiesSuccess);
    this.listenTo(AlbumsActions.getCategories.failed,this.onFailed);
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
    //
  },
  onGetMyAlbumsSuccess : function(res){
    if(res.Success){
      this.data.workList = res.Result;
      this.data.hintMessage = '';
    }else{
      this.data.workList = [];
      this.data.hintMessage = res.ErrorMsg;
    }
    this.data.flag = 'getMyAlbums';
    this.trigger(this.data);
  },
  onGetCategoiesSuccess : function(res){
    if(res.Success){
      this.data.categories = res.Result;
      this.hintMessage = '';
    }else{
      this.data.hintMessage = res.ErrorMsg;
    }
    this.data.flag = 'getCategories';
    this.trigger(this.data);
  }
});

module.exports = AlbumsStore;
