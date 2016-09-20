var Reflux = require('reflux');

var LogActions = require('../actions/LogActions');
var data = [];

var LogStore = Reflux.createStore({

  init: function() {
    this.listenTo(LogActions.log.success,this.onLogSuccess);
    this.listenTo(LogActions.log.failed,this.onFailed);
  },
  onLogSuccess : function(data){
  },
  onFailed : function(data){
    this.data.hintMessage = '网络错误！';
    this.data.flag = 'failed';
    this.trigger(this.data);
  }
});

module.exports = GetCodeStore;
