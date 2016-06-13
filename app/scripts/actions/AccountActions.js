var Reflux = require('reflux');
var HttpFactory = require('../HttpFactory');
var API = require('../api');

var AccountActions = Reflux.createActions({
  'changeAvatar': {children: ['success', 'failed']},
  'updateInfo': {children: ['success', 'failed']},
  'userDetail': {children: ['success', 'failed']},
  'changeContactDetail': {children: ['success', 'failed']},
  'changeRealName': {children: ['success', 'failed']},
});

var mockFunc = function(originalFunc, data) {
  return function(respData) {
    originalFunc(respData, data);
  };
};

AccountActions.changeAvatar.listen(function (data) {
  const self = this;
  HttpFactory.post(
    API.USER.changeAvatar,
    data,
    mockFunc(self.success, data),
    this.failed
  );
});

AccountActions.updateInfo.listen(function(data){
  const self = this;
  HttpFactory.post(
    API.USER.updateInfo,
    data,
    mockFunc(self.success, data),
    this.failed
  );
});

AccountActions.userDetail.listen(function(){
  var data = {
    Fields: 'Id,NickName,Sex,Avatar,Signature,' +
    'ProvinceId,CityId,CountyId,' +
    'Account.RealNameState,Account.RealNameFailedReason,Account.Type,' +
    'Account.ContactWeibo,Account.ContactWeixin,Account.ContactOicq,Account.Tel',
  };
  HttpFactory.post(API.USER.currentUserDetail, data,this.success, this.failed);
});

AccountActions.changeContactDetail.listen(function(data){
  HttpFactory.post(API.USER.changeContactDetail, data, this.success, this.failed);
});

AccountActions.changeRealName.listen(function(data){
  HttpFactory.post(API.USER.changeRealName, data, this.success, this.failed);
});

module.exports = AccountActions;
