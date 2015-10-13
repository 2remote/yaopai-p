var React = require('react');
var Reflux = require('reflux');
var WorkActions  = require('../../actions/WorkActions');
var WorkStore = require('../../stores/WorkStore');
var UploadActions = require('../../actions/UploadActions');
var UploadTokenStore = require('../../stores/UploadTokenStore');

var API = require('../../api');
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
      index : '',
      imageData: {},
    }
  },
  handleChange : function(event){
    WorkActions.editImageDes(this.props.index,event.target.value);
  },
  deleteItem : function(event){
    if(this.props.isCover){
      this.props.onSetCover(-1);
    }
    WorkActions.removeImage(this.props.index);
  },
  moveUpItem : function(event){
    WorkActions.moveUpImage(this.props.index);
  },
  moveDownItem : function(event){
    WorkActions.moveDownImage(this.props.index);
  },
  setCover : function(event){
    this.props.onSetCover(this.props.index);
  },
  componentDidMount : function(){

  },
  componentWillReceiveProps : function(nextProps){
    if(nextProps.imageData.Description != this.props.imageData.Description){
      this.refs.description.getDOMNode().value= (nextProps.imageData.Description);
    }
  },
  render : function(){
    var coverStyle = {
      color : 'blue'
    };
    var nomalStyle = {
      color : '#000'
    }
    return (
      <div className="image-item">
        <div className="move-button">
          <div className="icon-wrap">
            <span className="glyphicon glyphicon-triangle-top image-button" onClick={this.moveUpItem}></span>
          </div>
          <div className="icon-wrap">
            <span className="glyphicon glyphicon-triangle-bottom image-button" onClick={this.moveDownItem}></span>
          </div>
        </div>
        <div className="main-image">
          <img height="75" width="75" src={this.props.imageData.Url} />
        </div>
        <div className="main-des">
          <textarea type="textarea" ref="description" onChange={this.handleChange}  />
        </div>
        <div className="delete-button">
          <div className="right-icon">
            <span className="glyphicon glyphicon-picture image-button"
              style={this.props.isCover?coverStyle:nomalStyle}
              onClick={this.setCover}>
              封面
            </span>
          </div>
          <div className="right-icon">
            <span className="glyphicon glyphicon-remove-circle image-button"
              onClick={this.deleteItem}>
              删除
            </span>
          </div>
        </div>
      </div>
      );
  }
});
/*
  解释一下ChooseImage的逻辑
  1. 传入value，用this.props.value渲染ImageItem
  2. ImageItem 引入WorkAction 实现删除及位置的变换
  3. ChooseImages 监听WorkStore,将位置及删除结果返回到state，并调用updateValue通知父组件更新状态
  4. ChooseImages 的状态imageItemList需要记录上传的结果和进度，是否需要渲染出来根据以后的需求
*/
var ChooseImages = React.createClass({
  mixins : [Reflux.listenTo(WorkStore,'onStatusChange')],
  tokenFlag : 'work',
  uploaderOption : {
    runtimes: 'html5,flash,html4',
    browse_button: 'pickfiles',
    container: 'pickfilesCont',
    drop_element: 'container',
    max_file_size: '100mb',
    flash_swf_url: 'vendor/Moxie.swf',
    dragdrop: true,
    chunk_size: '4mb',
    uptoken_url: API.FILE.work_token_url,
    domain: 'http://qiniu-plupload.qiniudn.com/',
    get_new_uptoken: true,
    auto_start: true,
    init: {
            'FilesAdded': function(){},
            'BeforeUpload': function(up, file) {
                var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                if (up.runtime === 'html5' && chunk_size) {
                    // progress.setChunkProgess(chunk_size);
                    console.log(chunk_size);
                }
            },
            'UploadProgress': function(up, file) {},
            'UploadComplete': function() {},
            'FileUploaded': function(up, file, info) {},
            'Error': function(up, err, errTip) {
                // var progress = new FileProgress(err.file, 'fsUploadProgress');
                // progress.setError();
                // progress.setStatus(errTip);
            }
        }
  },
  getInitialState : function(){
    return {
      imageItemList : [],
    }
  },
  getDefaultProps : function(){
    return {
      value : [],
      updateValue : function(data){},
      cover : '',
      updateCover : function(data){},
    }
  },
  onStatusChange : function(data){
    this.setState({imageItemList : data});
    this.props.updateValue(data);
  },

  /*
    增加文件后，加入imageList
    创建imageItem
  */
  onAddFiles : function(up, files) {
    plupload.each(files, function(file) {
        console.log(file);
        var imageItem = {
          id: file.id,
          imageFile : file,
          Url: '',
          Description : '',
          uploaded:false,
          progress:0
        };
        this.addImage(imageItem);
      }.bind(this));
  },
  //清空图片
  clearImage : function(){
    WorkActions.clearImage();
  },
  /*
    单个文件上传完毕后，返回值info.Url是图片地址
  */
  onFileUploaded : function(up,file,info){
    var list = this.state.imageItemList;
    var res = JSON.parse(info);
    list.map(function(item){
      if(item.id == file.id){
        item.Url = res.Url;
        item.uploaded = true;
      }
    });
    this.setState({imageItemList : list});
    console.log(info);
  },
  /*
    单个文件的上传进度
  */
  onUploadProgress : function(up,file){
    var list = this.state.imageItemList;
    var item = list.map(function(item){
      if(item.id == file.id){
        item.progress = file.percent;
      }
    });
    this.setState({imageItemList : list});
  },

  onUploadComplete : function(){
    console.log('all files upload complete.');
  },
  /*
    初始化uploader
  */
  componentDidMount : function() {
    this.initUploader();
  },
  initUploader : function(){
    this.uploaderOption.init.FilesAdded = this.onAddFiles;
    this.uploaderOption.init.UploadComplete = this.onUploadComplete;
    this.uploaderOption.init.FileUploaded = this.onFileUploaded;
    this.uploaderOption.init.UploadProgress = this.onUploadProgress;
    this.uploader = Qiniu.uploader(this.uploaderOption);
  },
  //返回图片列表
  getValue : function(){
    if(this.state.imageItemList.length == 0) return null;
    return this.state.imageItemList;
  },
  //增加图片
  addImage : function(item){
    WorkActions.addImage(item);
  },
  render :function(){
    var renderImages = this.props.value.map(function(imageItem,i){
      return(
        <ImageItem index={i} 
          isCover={this.props.cover==i} 
          imageData={imageItem} 
          onSetCover={this.props.updateCover}/>
        );
    }.bind(this));
    return (
        <div className="form-group">
          <label className="control-label col-xs-2">上传图片：</label>
          <div id="pickfilesCont" className="col-xs-10">
            <div>
              <img id="pickfiles" className="image-button uploader-img" width="80" heigth="80" src="img/tianjia.png" />
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