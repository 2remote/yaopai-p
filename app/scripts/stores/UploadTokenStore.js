var Reflux = require('reflux');
var UploadActions = require('../actions/UploadActions');

var data = [];
var UploadTokenStore = Reflux.createStore({
  tokens : {},
  errorCode : '',
  errorMessage : '',

  init: function() {
    this.listenTo(UploadActions.getToken.success, this.onGetTokenSuccess);
    this.listenTo(UploadActions.getToken.failed, this.onGetTokenFailed);
  },
  onGetTokenSuccess : function(data){
    if(data.Success){
      // this.tokens[data.Type] = data.Token;
      //this.tokens['work'] = data.Token;
      //this.tokens['flag'] = 'work';
      this.tokens['token'] = data.Token;
      this.tokens['type'] = data.Type;
      this.errorCode = '';
      this.errorMessage = '';
    }else{
      this.errorCode = data.errorCode;
      this.errorMessage = data.errorMessage;
    }
    this.trigger(this.tokens);
  },
  onGetTokenFailed : function(data){
    this.errorCode = data.errorCode;
    this.errorMessage = data.errorMessage;
    this.trigger(this.tokens);
  },




});

module.exports = UploadTokenStore;
