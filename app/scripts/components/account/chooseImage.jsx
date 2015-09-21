var React = require('react');
var Reflux = require('reflux');
var WorkActions  = require('../../actions/WorkActions');
var WorkStore = require('../../stores/WorkStore');

var Input = require('react-bootstrap').Input;
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
    }
  },
  handleChange : function(event){
    WorkActions.editImageDes(this.props.imageData,this.refs.description.getValue());
  },
  deleteItem : function(event){
    WorkActions.removeImage(this.props.imageData);
  },
  moveUpItem : function(event){
    WorkActions.moveUpImage(this.props.imageData);
  },
  moveDownItem : function(event){
    WorkActions.moveDownImage(this.props.imageData);
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
          <Input type="textarea" ref="description" onChange={this.handleChange} value={this.props.imageData.imageDes} />
        </div>
        <div className="delete-button">
          <span className="glyphicon glyphicon-remove-circle image-button" onClick={this.deleteItem}></span>
        </div>
      </div>
      );
  }
});

var ChooseImages = React.createClass({
  mixins: [Reflux.listenTo(WorkStore, 'onStatusChange')],
  getInitialState : function(){
    return {
      imageItemList : []
    }
  },
  onStatusChange : function(data){
    this.setState({imageItemList : data});
  },
  /*
    通过FileReader读取图片文件
  */
  componentDidMount : function() {
    //this.reader = new FileReader()
    //this.reader.onload = this.fileLoaded
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
      console.log(event.target.files);
      for(var i = 0 ; i < event.target.files.length;i++){
        var fr = new FileReader();
        fr.onload = this.fileLoaded;
        fr.readAsDataURL(event.target.files[i]);
      }
    }
  },
  //返回图片列表
  getImages : function(){
    return this.state.imageItemList;
  },
  //增加图片
  addImage : function(item){
    WorkActions.addImage(item);
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
              <input type="file" ref="selectImage" className="hidden" onChange={this.selectImage} multiple="multiple"/>
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