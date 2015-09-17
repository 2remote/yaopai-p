var Reflux = require('reflux');

var OrderActions = Reflux.createActions([
  'listOrders',
  'getOrder',
  'bookOrder',
  'comfirmOrder',
]);

module.exports = OrderActions;
