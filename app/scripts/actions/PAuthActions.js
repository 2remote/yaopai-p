var Reflux = require('reflux');
var HttpFactory = require('../HttpFactory');
var API = require('../api');

var PAuthActions = Reflux.createActions({
  'submitAudit' : {children:['success','failed']},
  'viewAudit' : {children : ['success','failed']},
  'get' : {children : ['success','failed']},
  'current' : {children : ['success','failed']},
  'change' : {children : ['success','failed']},
  'currentStudio' : {children : ['success','failed']},
  'changeStudio' : {children : ['success','failed']}
});

PAuthActions.submitAudit.listen(function(data){
  HttpFactory.post(API.PHOTOGRAPHER.submitAudit,data,this.success,this.failed);
});

PAuthActions.viewAudit.listen(function(data){
  HttpFactory.post(API.PHOTOGRAPHER.viewAudit,data,this.success,this.failed);
});

PAuthActions.get.listen(function(data){
  HttpFactory.post(API.PHOTOGRAPHER.get,data,this.success,this.failed);
});

PAuthActions.current.listen(function(){
  var data = {
    Fields : 'Id,BusinessPhone,Oicq,OwnedStudio,RealName,Signature,Weixin,IdNumber,ProvinceId,CityId,CountyId'
  };
  HttpFactory.post(API.PHOTOGRAPHER.current,data,this.success,this.failed);
});

PAuthActions.change.listen(function(data){
  HttpFactory.post(API.PHOTOGRAPHER.change,data,this.success,this.failed);
});

PAuthActions.currentStudio.listen(function(){
  var data = {
    Fields : 'Id,Address,Images,Introduction,Logo,Name'
  };
  HttpFactory.post(API.PHOTOGRAPHER.currentStudio,data,this.success,this.failed);
});

PAuthActions.changeStudio.listen(function(data){
  HttpFactory.post(API.PHOTOGRAPHER.changeStudio,data,this.success,this.failed);
});

module.exports = PAuthActions;
