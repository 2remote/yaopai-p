var Reflux = require('reflux');

var AreaActions = require('../actions/AreaActions');

var AreaStore = Reflux.createStore({
  data:{},

  init: function() {
    console.log('AreaStore initialized');
    
    this.listenTo(AreaActions.getAll.success,this.onGetAllSuccess);
    this.listenTo(AreaActions.getAll.failed,this.onGetAllFailed);
  },
  onGetAllSuccess : function(data){
    if(data.Success){
      this.data.allArea = data.Result;
    }else{
      this.data.hintMessage = data.ErrorMsg;
    }
    this.data.flag = "getAll";
    this.trigger(this.data);
  },
  onGetAllFailed : function(data){
    this.data.hintMessage = "网络出错了，请重试！";
    this.data.flag = "getAll"
    this.trigger(this.data);
  },

});

module.exports = AreaStore;
