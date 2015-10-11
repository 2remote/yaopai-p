var Reflux = require('reflux');
var WorkActions = require('../actions/WorkActions');

var WorkStore = Reflux.createStore({
  init : function () {
    this.images = [];
    this.listenTo(WorkActions.addImage, this.onAddImage);
    this.listenTo(WorkActions.removeImage, this.onRemoveImage);
    this.listenTo(WorkActions.moveUpImage, this.OnMoveUp);
    this.listenTo(WorkActions.moveDownImage, this.OnMoveDown);
    this.listenTo(WorkActions.editImageDes, this.OnEditDes);
  },
  onAddImage : function(data){
    data.key = this.images.length;
    this.images.push(data);
    this.trigger(this.images);
  },
  onRemoveImage : function(index){
    if(index > -1){
      this.images.splice(index,1);
    }
    this.trigger(this.images);
  },
  swapImage : function(index1,index2){
    if(index1 > -1  && index1 < this.images.length && index2 > -1 && index2 < this.images.length){
      this.images[index1] = this.images.splice(index2, 1, this.images[index1])[0];
    }
  },
  OnMoveUp : function(index){
    if(index == 0)return;
    this.swapImage(index,index-1);
    this.trigger(this.images);
  },
  OnMoveDown : function(index){
    if(index == this.images.length - 1)return;
    this.swapImage(index,index + 1);
    this.trigger(this.images);
  },
  refreshKeys : function(){
    for(var i = 0 ; i < this.images.length; i ++){
      this.images[i].key = i;
    }
  },
  OnEditDes : function(index,desc){
    if(index > -1){
      this.images[index].Description =desc;
    }
    this.trigger(this.images);
  }
});

module.exports =  WorkStore;