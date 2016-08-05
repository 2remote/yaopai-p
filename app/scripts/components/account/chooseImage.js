var React = require('react');
var ProgressBar = require('react-bootstrap').ProgressBar;
var TextInput = require('./textInput');
var Reflux = require('reflux');
var WorkActions  = require('../../actions/WorkActions');
var LogActions  = require('../../actions/LogActions');
var UserActions = require("../../actions/UserActions");
var UserStore = require("../../stores/UserStore");
var API = require('../../api');
var Input = require('react-bootstrap').Input;
var Tools = require('../../tools');

import { ROUTE_LOGIN } from '../../routeConfig'
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
  getInitialState : function(){
    return {
      progress : 0
    }
  },
  getDefaultProps : function(){
    return{
      index : '',
      imageData: {},
      progress:0
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
    if(this.props.imageData.isCover){
      return
    }
    WorkActions.setCover(this.props.index);
    var flag = true;
    while(flag){
      if(this.state.progress==100){
        var src = this.props.imageData.Url;
        Tools.crop(src, function (cut) {
          WorkActions.setCut(cut);
        });
        flag = false;
      }
    }
  },
  componentDidMount : function(){

  },
  componentWillReceiveProps : function(nextProps){
    if(nextProps.imageData.Description != this.props.imageData.Description){
      this.refs.description.getDOMNode().value= (nextProps.imageData.Description);
    }
    this.setState({ progress:nextProps.progress})
  },
  imageMogr2 : function(url){
    return url+'?imageMogr2/gravity/Center/thumbnail/!75x75r/crop/75x75/interlace/1';
  },
  render : function(){
    var coverStyle = {
      color : '#337ab7',
    };
    var normalStyle = {
      color : '#b3b3b3',
    }
    return (
      <div>
        <div className="image-item">
          <canvas ref='image2' style={{display:'none'}}></canvas>
          <div className="move-button">
            <div className="icon-wrap">
              <span className="glyphicon glyphicon-triangle-top image-button" onClick={this.moveUpItem}></span>
            </div>
            <div className="icon-wrap">
              <span className="glyphicon glyphicon-triangle-bottom image-button" onClick={this.moveDownItem}></span>
            </div>
          </div>
          <div className="main-image">
            <img ref={'image_'+this.props.index} width="75" height="75" src={this.props.imageData.Url?this.imageMogr2(this.props.imageData.Url):''} alt="上传图片"/>
          </div>
          <div className="main-des">
            <textarea ref="description" type="textarea" onChange={this.handleChange} className="col-xs-12"  placeholder="照片描述" />
          </div>
          <div className="delete-button">
            {/* <div className="right-icon">
              <span className="glyphicon glyphicon-picture image-button"
                style={this.props.imageData.isCover?coverStyle:normalStyle}
                onClick={this.setCover}>
                封面
              </span>
            </div> */}
            <div className="right-icon">
              <span className="glyphicon glyphicon-remove-circle image-button"
              style={normalStyle}  onClick={this.deleteItem}>
                删除
              </span>
            </div>
          </div>
        </div>
        <ProgressBar now={this.state.progress} label={this.state.progress+'%'} />
      </div>
      );
  }
});
/*
  解释一下ChooseImage的逻辑
  1. 传入value，用this.props.value渲染ImageItem
  2. ImageItem 引入WorkAction 实现删除及位置的变换
  3. 父组件 监听WorkStore,将位置及删除结果返回到本组件的props.value
  4. ChooseImages 的状态imageItemList需要记录上传的结果和进度，是否需要渲染出来根据以后的需求
*/
var ChooseImages = React.createClass({
  mixins : [Reflux.listenTo(UserStore, 'onUserStoreChange')],
  getInitialState : function(){
    return {
      reloadTime : 0,
      value:[],
    }
  },
  items : [],
  uploaderOption : {
    runtimes: 'html5,flash,html4',
    browse_button: 'pickfiles',
    container: 'pickfilesCont',
    drop_element: 'container',
    flash_swf_url: 'vendor/Moxie.swf',
    dragdrop: true,
    //chunk_size: '4mb',
    domain: 'http://qiniu-plupload.qiniudn.com/',
    get_new_uptoken: true,
    auto_start: true,
    filters : {
      max_file_size: '10mb',
      mime_types: [
        {title : "Image files", extensions : "jpg,png,jpeg"}, // 限定jpg,png后缀上传
      ]
    },
    init: {
      'FilesAdded': function(){},
      'BeforeUpload': function(up, file) {
        //var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
        //if (up.runtime === 'html5' && chunk_size) {
        //    // progress.setChunkProgess(chunk_size);
        //    console.log(chunk_size);
        //}
        console.log(file.name+"::"+file.origSize);
        if(file.origSize >= 1024 * 1024){
          console.log("resize 1M: 95");
          up.setOption('resize',{width : 1125, height : 2208,enabled:true,quality:85});
        }else{
          console.log("resize desabled");
          up.setOption('resize',false);
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
  getDefaultProps : function(){
    return {
      value : [],
    }
  },
  onUserStoreChange: function (data) {
    if (!data.isLogin) {
      //没有登录跳转到首页登录界面
      UserActions.logout(true);
      this.history.pushState(null, ROUTE_LOGIN);
    }else{
      if(data.flag == 'currentUser'){
        this.initUploader(data.sessionToken);
      }
    }
  },

  /*
    增加文件后，加入imageList
    创建imageItem
  */
  onAddFiles : function(up, files) {
    plupload.each(files, function(file) {
      var imageItem = {
        id: file.id,
        imageFile : file,
        Url: '',
        Description : '',
        uploaded:false,
        progress:0,
        isCover : false,
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
    console.log(file);
    var res = JSON.parse(info);
    WorkActions.updateImageUrl(file.id,res.Url);
  },
  /*
    单个文件的上传进度
  */
  onUploadProgress : function(up,file){
    this.setState({reloadTime : ++this.state.reloadTime});
  },

  onUploadComplete : function(){
    console.log('all files upload complete.');
  },

  onError : function(up, err, errTip) {
    LogActions.log({
      title: 'chooseImage',
      msg: JSON.stringify(err)
    });
    //上传出错时,处理相关的事情
    if(this.props.onError){
      var max_file_size = plupload.parseSize('10mb');
      if(err.file.size > max_file_size){
        this.props.onError('您上传的图片大于 10 M，请压缩后再上传');
      }else{
        if(err.code == -601){
          this.props.onError('图片格式错误');
        }else{
          this.props.onError(err.message);
        }
      }
    }
  },
  /*
    初始化uploader
  */
  componentDidMount : function() {
    this.setState({value:this.props.value,initQiniu:false});
    this.clearImage();
    UserActions.currentUser();
  },
  componentWillReceiveProps : function(nextProps){
    this.setState({value:nextProps.value})
  },
  initUploader : function(sessionToken){
    if(!this.state.initQiniu){
      this.uploaderOption.uptoken_url = API.FILE.work_token_url+'&tokenid='+sessionToken;
      this.uploaderOption.init.FilesAdded = this.onAddFiles;
      this.uploaderOption.init.UploadComplete = this.onUploadComplete;
      this.uploaderOption.init.FileUploaded = this.onFileUploaded;
      this.uploaderOption.init.UploadProgress = this.onUploadProgress;
      this.uploaderOption.init.Error = this.onError;
      this.uploader = Qiniu.uploader(this.uploaderOption);
      this.setState({initQiniu:true})
    }
  },
  //增加图片
  addImage : function(item){
    WorkActions.addImage(item);
  },
  render :function(){
    var renderImages = [];
    this.state.value.map(function(imageItem,i){
      renderImages.push(
        <ImageItem
          key={imageItem.id}
          index={i}
          imageData={imageItem}
          onSetCover={this.props.updateCover}
          progress={imageItem.imageFile.percent}/>
      )
    }.bind(this));
    return (
      <div className="form-group">
        <label className="control-label col-xs-3">上传样片 (至少6张)：</label>
        <div id="pickfilesCont" className="col-xs-8">
          <div>
            <img id="pickfiles" className="image-button uploader-img" width="140" src="img/tianjia.png" />
          </div>

            {renderImages}
          
        </div>
      </div>
    );
  }
});

module.exports = ChooseImages;
