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
    console.log(data);
    if(data.Success){
      // this.tokens[data.Type] = data.Token;
      this.tokens['work'] = data.Token;
      this.tokens['flag'] = 'work';
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
    console.log(data);
    this.trigger(this.tokens);
  },




});

module.exports = UploadTokenStore;
