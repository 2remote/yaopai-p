var React = require('react');

/*
  data structure
  {
    imageUrl,
    imageDes,
    key,
    isCover
  }
  ImageItem 用于显示单条图片信息
*/
var ImageItem = React.createClass({
  getDefaultProps : function(){
    return{
      imageData: {},  
      onDelete : function(){},
      onMoveUp : function(){},
      onMoveDown : function(){}
    }
  },
  handleChange : function(event){
    this.props.imageData.imageDes = event.target.value;
  },
  deleteItem : function(event){
    this.props.onDelete(this.props.imageData);
  },
  moveUpItem : function(event){
    this.props.onMoveUp(this.props.imageData);
  },
  moveDownItem : function(event){
    this.props.onMoveDown(this.props.imageData);
  },
  render : function(){
    return (
      <div className="image-item">
        <div className="move-button">
          <span className="glyphicon glyphicon-chevron-up image-button" onClick={this.moveUpItem}></span>
          <span className="glyphicon glyphicon-chevron-down image-button" onClick={this.moveDownItem}></span>
        </div>
        <div className="main-image">
          <img height="60" width="60" src={this.props.imageData.imageUrl} />
        </div>
        <div className="main-des">
          <textarea type="textarea" ref="description" onChange={this.handleChange} >{this.props.imageData.imageDes}</textarea>
        </div>
        <div className="delete-button">
          <span className="glyphicon glyphicon-remove-circle image-button" onClick={this.deleteItem}></span>
        </div>
      </div>
      );
  }
});

var ChooseImages = React.createClass({
  getInitialState : function(){
    return {
      imageItemList : []
    }
  },
  /*
    通过FileReader读取图片文件
  */
  componentDidMount : function() {
    this.reader = new FileReader()
    this.reader.onload = this.fileLoaded
  },
  /*
    读取成功后加载Image
  */
  fileLoaded : function(event) {
    var imageItem = {imageUrl : event.target.result,imageDes : ''};
    this.addImage(imageItem);
  },
  selectImage : function(event){
    if(event.target.files && event.target.files[0]) {
      //this.setState({ loading: true, fileURL: null })
      this.reader.readAsDataURL(event.target.files[0])
    }
  },
  //返回图片列表
  getImages : function(){
    return this.state.imageItemList;
  },
  //增加图片
  addImage : function(item){
    if(this.state.imageItemList.length == 0){
      //设置封面
      item.isCover =  true;
    }
    item.key = this.state.imageItemList.length;
    var list = this.state.imageItemList;
    list.push(item);
    this.setState({imageItemList : list});
  },
  //删除图片
  deleteImage : function(item){
    var len = this.state.imageItemList.length;
    var list = []
    var index = -1;
    for(var i = 0 ;i < len; i++ ){
      if(item.key == this.state.imageItemList[i].key){
        index = i;
        break;
      }
    }
    if(index > -1){
      this.state.imageItemList.splice(index,1);
      list = this.state.imageItemList;
      //重新生成key
      for(var i = 0 ; i < list.length; i++){
        list[i].key = i ;
      }
      this.setState({imageItemList : list});
    }
  },
  /*
    移动图片
    暂时只做移动按钮
  */
  swapItems : function(arr, index1, index2) {
    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
    return arr;
  },
  /*
    上移
  */
  moveUp : function(item){
    if(item.key == 0)return;
    var list = this.state.imageItemList;
    list = this.swapItems(list,item.key,item.key-1);
    //重新生成key
    for(var i = 0 ; i < list.length; i++){
      list[i].key = i ;
    }
    this.setState({imageItemList : list});
  },
  /*
    下移
  */
  moveDown : function(item){
    if(item.key == this.state.imageItemList.length-1) return;
    var list = this.state.imageItemList;
    list = this.swapItems(list,item.key,item.key+1);
    //重新生成key
    for(var i = 0 ; i < list.length; i++){
      list[i].key = i ;
    }
    this.setState({imageItemList : list});
  },
  handleClick : function(){
    React.findDOMNode(this.refs.selectImage).click();
  },
  render :function(){
    var renderImages = this.state.imageItemList.map(function(imageItem,i){
      return(
        <ImageItem imageData={imageItem} onDelete={this.deleteImage} onMoveUp={this.moveUp} onMoveDown={this.moveDown}/>
        );
    }.bind(this));
    return (
        <div className="form-group">
          <label className="control-label col-xs-2">上传图片：</label>
          <div className="col-xs-10">
            <div>
              <img className="image-button" width="80" heigth="80" src="../../../img/tianjia.png" onClick={this.handleClick} />
              <input type="file" ref="selectImage" className="hidden" onChange={this.selectImage} />
            </div>
            <div>
              {renderImages}
            </div>
          </div>
        </div>
      );
  }
});

module.exports = ChooseImages;