var Reflux = require('reflux');

var OrderActions = Reflux.createActions({
  'listOrders' : {children:['success','failed']} ,
  'getOrder' : {children:['success','failed']} ,
  'bookOrder' : {children:['success','failed']} ,
  'comfirmOrder' : {children:['success','failed']} ,
});

module.exports = OrderActions;
