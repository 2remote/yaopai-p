var Reflux = require('reflux');

var HttpFactory = require('../HttpFactory');
var API = require('../api');

var AreaActions = Reflux.createActions({
  'getAll' : {children:['success','failed']}
  
});

AreaActions.getAll.listen(function(data){
  HttpFactory.post(API.common_api.area_list,data,this.success,this.failed);
});
module.exports = AreaActions;
