var Reflux = require('reflux');
var HttpFactory = require('../HttpFactory');
var API = require('../api');

var UploadWorksActions = Reflux.createActions({
  'get':{children : ['success','failed']},
  'add':{children : ['success','failed']},
  'update':{children : ['success','failed']},
  'delete':{children : ['success','failed']},
  'search':{children : ['success','failed']},
  // Here you can list your actions
});

UploadWorksActions.add.listen(function(data){
  HttpFactory.post(API.ALBUMS.add,data,this.success,this.failed);
});
UploadWorksActions.get.listen(function(data){
  HttpFactory.post(API.ALBUMS.get,data,this.success,this.failed);
});
UploadWorksActions.update.listen(function(data){
  HttpFactory.post(API.ALBUMS.update,data,this.success,this.failed);
});
UploadWorksActions.delete.listen(function(data){
  HttpFactory.post(API.ALBUMS.delete,data,this.success,this.failed);
});
UploadWorksActions.search.listen(function(data){
  HttpFactory.post(API.ALBUMS.search,data,this.success,this.failed);
});




module.exports = UploadWorksActions;
