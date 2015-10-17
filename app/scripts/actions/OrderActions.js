var Reflux = require('reflux');
var HttpFactory = require('../HttpFactory');
var API = require('../api');

var OrderActions = Reflux.createActions({
  'list' : {children:['success','failed']} ,
  'get' : {children:['success','failed']} ,
  'add' : {children:['success','failed']} ,
  'comfirm' : {children:['success','failed']} ,
  'close' : {children:['success','failed']} ,
});

OrderActions.list.listen(function(data){
  if(type == 1)
    HttpFactory.post(API.ORDER.outSearch,data,this.success,this.failed);
  else
    HttpFactory.post(API.ORDER.inSearch,data,this.success,this.failed);
});

module.exports = OrderActions;
