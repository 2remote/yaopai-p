var Reflux = require('reflux');
var UploadActions = require('../actions/UploadActions');

var data = [];
var UploadTokenStore = Reflux.createStore({
  tokens : [],
  errorCode : '',
  errorMessage : '',

  init: function() {
    console.log('UploadStore initialized');

    this.listenTo(UploadActions.getToken.success, this.onGetTokenSuccess);  
    this.listenTo(UploadActions.getToken.failed, this.onGetTokenFailed); 
  },
  onGetTokenSuccess : function(data){
    if(data.Success){
      this.tokens[data.Type] = data.Token;
      this.errorCode = '';
      this.errorMessage = '';
    }else{
      this.errorCode = data.errorCode;
      this.errorMessage = data.errorMessage;
    }
    this.trigger(tokens);
  },
  onGetTokenFailed : function(data){
    this.errorCode = data.errorCode;
    this.errorMessage = data.errorMessage;
    this.trigger(tokens);
  },




});

module.exports = UploadTokenStore;
