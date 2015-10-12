var Reflux = require('reflux');

var WorkActions = Reflux.createActions([
  'addImage',
  'removeImage',
  'editImageDes',
  'moveUpImage',
  'moveDownImage',
  'clearImage'
]);

module.exports = WorkActions;