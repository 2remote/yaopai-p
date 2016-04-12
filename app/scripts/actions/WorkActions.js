var Reflux = require('reflux');

var WorkActions = Reflux.createActions([
  'addImage',
  'removeImage',
  'editImageDes',
  'setCover',
  'setCut',
  'updateImageUrl',
  'moveUpImage',
  'moveDownImage',
  'clearImage'
]);

module.exports = WorkActions;