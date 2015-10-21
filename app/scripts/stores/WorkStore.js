var Reflux = require('reflux');
var WorkActions = require('../actions/WorkActions');

var WorkStore = Reflux.createStore({
  init : function () {
    this.images = [];
    this.listenTo(WorkActions.addImage, this.onAddImage);
    this.listenTo(WorkActions.removeImage, this.onRemoveImage);
    this.listenTo(WorkActions.moveUpImage, this.onMoveUp);
    this.listenTo(WorkActions.moveDownImage, this.onMoveDown);
    this.listenTo(WorkActions.updateImageUrl, this.onUpdateImageUrl);
    this.listenTo(WorkActions.editImageDes,this.OnEditDes);
    this.listenTo(WorkActions.clearImage,this.onClearImage);
    this.listenTo(WorkActions.setCover,this.onSetCover);
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
  onClearImage : function(){
    this.images = [];
  },
  swapImage : function(index1,index2){
    if(index1 > -1  && index1 < this.images.length && index2 > -1 && index2 < this.images.length){
      this.images[index1] = this.images.splice(index2, 1, this.images[index1])[0];
    }
  },
  onSetCover : function(index){
    if(index < 0)return;
    this.images.map(function(item,i){
      if(item.isCover){
        item.isCover = false;
      }
    });
    this.images[index].isCover = true;
    this.trigger(this.images);
  },
  onMoveUp : function(index){
    if(index == 0)return;
    this.swapImage(index,index-1);
    this.trigger(this.images);
  },
  onMoveDown : function(index){
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
  },
  onUpdateImageUrl :function(id,url){
    if(url != ''){
      this.images.map(function(item){
        if(item.id == id) item.Url = url;
      });
    }
    this.trigger(this.images);
  }
});

module.exports =  WorkStore;