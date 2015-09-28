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
      imageData: {},  
    }
  },
  getInitialState : function(){
    return {
      imageUrl : ''
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
  
  /*
    读取成功后加载Image
  */
  fileLoaded : function(event) {
    this.setState({imageUrl : event.target.result});
  },
  componentDidMount : function(){
    // if(this.props.imageData.imageFile){
    //   var fr = new FileReader();
    //   fr.onload = this.fileLoaded;
    //   fr.readAsDataURL(this.props.imageData.imageFile);
    // }
    // this.initUploader();
  },
  render : function(){
    return (
      <div className="image-item">
        <div className="move-button">
          <span className="glyphicon glyphicon-chevron-up image-button" onClick={this.moveUpItem}></span>
          <span className="glyphicon glyphicon-chevron-down image-button" onClick={this.moveDownItem}></span>
        </div>
        <div className="main-image">
          <img height="60" width="60" src={this.state.imageUrl} />
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
  mixins: [Reflux.listenTo(WorkStore, 'onStatusChange'),Reflux.listenTo(UploadTokenStore, 'onGetToken')],
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
    uptoken_url: API.file_api.work_token_url,
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
      imageItemList : []
    }
  },
  onStatusChange : function(data){
    this.setState({imageItemList : data});
  },

  /*
    增加文件后，加入imageList
    创建imageItem
  */
  onAddFiles : function(up, files) {
    plupload.each(files, function(file) {
        console.log(file);
        var imageItem = {id: file.id,imageFile : file,imageUrl: '', imageDes : '',uploaded:false,progress:0};
        this.addImage(imageItem);
      }.bind(this));
  },
  /*
    单个文件上传完毕后，返回值info.Url是图片地址
  */
  onFileUploaded : function(up,file,info){
    var list = this.state.imageItemList;
    var item = list.map(function(item){
      if(item.id == file.id){
        return item;
      }
      return null;
    });
    if(item){
      item.imageUrl = info.Url;
      item.uploaded = true;
      this.setState({imageItemList : list});
    }
    console.log(info);
  },
  /*
    单个文件的上传进度
  */
  onUploadProgress : function(up,file){
    var list = this.state.imageItemList;
    var item = list.map(function(item){
      if(item.id == file.id){
        return item;
      }
      return null;
    });
    if(item){
      item.progress = file.percent;
      this.setState({imageItemList : list});
    }
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

    console.log(this.uploader);
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
          <div id="pickfilesCont" className="col-xs-10">
            <div>
              <img id="pickfiles" className="image-button" width="80" heigth="80" src="img/tianjia.png" />
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