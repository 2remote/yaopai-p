var Reflux = require('reflux');

var WorkActions = Reflux.createActions([
  'addImage',
  'removeImage',
  'editImageDes',
  'setCover',
  'setCoverUrl',
  'updateImageUrl',
  'moveUpImage',
  'moveDownImage',
  'clearImage'
]);

module.exports = WorkActions;