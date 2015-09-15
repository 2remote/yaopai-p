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
    }
  },
  handleChange : function(){

  },
  deleteItem : function(){
    this.props.onDelete(this.props.imageData);
  },
  render : function(){
    return (
      <div className="image-item">
        <div className="move-button">
          <span className="glyphicon glyphicon-chevron-up image-button"></span>
          <span className="glyphicon glyphicon-chevron-down image-button"></span>
        </div>
        <div className="main-image">
          <img height="60" width="60" src={this.props.imageData.imageUrl} />
        </div>
        <div className="main-des">
          <textarea type="textarea" ref="description" onChange={this.handleChange} />
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
    this.state.imageItemList.map(function(imageItem,i){
      if(item.key == imageItem.key){
        var list = this.imageItemList.splice(i,1);
        if(list.length > 0){
          list[0].isCover = true;
        }
        this.setState({imageItemList:list});
        return;
      }
    });
    //更新key
    this.state.imageItemList.map(function(imageItem,i){
      imageItem.key = i;
    });
  },
  /*
    移动图片
    暂时只做移动按钮
  */
  moveImage : function(item,to){
    
  },
  handleClick : function(){
    React.findDOMNode(this.refs.selectImage).click();
  },
  render :function(){
    var renderImages = this.state.imageItemList.map(function(imageItem,i){
      return(
        <ImageItem imageData={imageItem} onDelete={this.deleteImage}/>
        );
    });
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