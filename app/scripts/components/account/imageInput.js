var React = require ('react');
var Reflux = require('reflux');
var API = require('../../api');
var ProgressBar = require('react-bootstrap').ProgressBar;
var LogActions  = require('../../actions/LogActions');
var UserActions = require("../../actions/UserActions");
var UserStore = require("../../stores/UserStore");
import { History } from 'react-router'
import { ROUTE_LOGIN } from 'util/routeConfig'
import tianjiaImg from 'image/tianjia.png'

var ImageInput = React.createClass({
  mixins : [Reflux.listenTo(UserStore, 'onUserStoreChange'), History],
  getInitialState : function(){
    return {
      imageUrl : '',
      progress : 0,
      uploaderOption : {
        runtimes: 'html5,flash,html4',
        browse_button: '',
        flash_swf_url: 'vendor/Moxie.swf',
        dragdrop: false,
        domain: 'http://qiniu-plupload.qiniudn.com/',
        auto_start: true,
        get_new_uptoken: true,
        filters : {
          max_file_size: '10mb',
          mime_types: [
            {title : "Image files", extensions : "jpg,png,jpeg"}, // 限定jpg,png后缀上传
          ]
        },
        init: {
          'FilesAdded': function(up,files){},
          'BeforeUpload': function(up, file) {
            console.log(file.name+"::"+file.origSize);

            if(file.origSize >= 1024 * 1024){
              console.log("resize 1M: 95");
              up.setOption('resize',{width : 1125, height : 2208,enabled:true,quality:90});
            }else{
              console.log("resize desabled");
              up.setOption('resize',false);
            }
          },
          'UploadProgress': function(up, file) {},
          'UploadComplete': function() {},
          'FileUploaded': function(up, file, info) {},
          'Error': function(up, err, errTip) {}
        }
      },
    }
  },
  getDefaultProps : function(){
    return {
      multi_selection : true,
      disabled : false,
      defaultImage : tianjiaImg, //指定未上传时的图片
      colWidth : 'col-xs-4',  //指定所占列宽
      width : '150',  //图片高度
      height : '150', //指定图片高度
      type : '',  //必须指定图片类型 user, work...
      uid : 'imagePick', //当一个页面引用了多个ImageInput，必须指定不同的uid
      progress:0,
      onUpload : function(data){},  //上传成功后回调函数
      //onFileUploaded : function(up, file, info){},
      //onUploadProgress : function(up, file){}
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
  onFileUploaded : function(up,file,info){
    console.log(file);
    var res = JSON.parse(info);
    this.setState({imageUrl : res.Url});
    this.props.onUpload(res.Url); //上传成功后可以回调onUpload函数
  },
  onUploadProgress : function(up,file){
    //console.log(JSON.stringify(file))
    this.setState({progress :file.percent});
    //this.props.progress = file.percent;
  },
  onError : function(up, err, errTip) {
    LogActions.log({
      title: 'imageInput',
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
  getValue : function(){
    return this.props.defaultImage;
  },
  initUploader: function (sessionToken) {
    if(this.state.uploaderOption.browse_button != this.props.uid){
      this.state.uploaderOption.browse_button = this.props.uid;
      var uploaderOption = this.state.uploaderOption;
      uploaderOption.multi_selection = this.props.multi_selection;
      uploaderOption.uptoken_url = API.FILE.user_token_url +'&tokenid='+sessionToken;
      uploaderOption.init.FileUploaded = this.onFileUploaded;
      uploaderOption.init.UploadProgress = this.onUploadProgress;
      uploaderOption.init.Error = this.onError;
      Qiniu.uploader(uploaderOption);
    }
  },
  componentDidMount : function() {
    if(!this.props.disabled) {
      UserActions.currentUser();
    }
  },
  parseImageUrl :function(url){
    url = url + '?imageMogr2/gravity/Center'
    if(this.props.width && this.props.height){
      url = url + '/thumbnail/!'+this.props.width+'x'+this.props.height+'r'; //限制短边
      url = url + '/crop/'+this.props.width + 'x' + this.props.height; //剪裁
    }
    if(this.props.width && !this.props.height){
      url = url + '/thumbnail/'+this.props.width+'x'; //只缩放宽度,不剪裁
    }
    if(this.props.height && !this.props.width){
      url = url + '/thumbnail/x'+this.props.height; //只缩放高度,不剪裁
    }
    url = url + '/interface/1'; //渐进
    return url;
  },
  render : function (){
    var imgStyle ={
      cursor : 'pointer',
      borderRadius : this.props.circle?'50%':'0'
    };
    var noStyle = {
      borderRadius : this.props.circle?'50%':'0'
    };
    var hide = {
      display : 'none'
    }
    var progressBar = <div></div>;
    if(this.state.progress> 0 && this.state.progress< 100){
      progressBar = <ProgressBar now={this.state.progress} label={this.state.progress+'%'} />
    }
    return (
      <div style={this.props.addStyle} className={this.props.colWidth}>
        <div style={this.props.disabled?hide:{}}>
          <img id={this.props.uid}
            style={this.props.disabled? hide : imgStyle}
            width={this.props.width}
            src={this.parseImageUrl(this.props.defaultImage)} />
        </div>
        <div style={this.props.disabled? {} : hide}>
          <img
            style={this.props.disabled? noStyle : hide}
            width={this.props.width}
            src={this.parseImageUrl(this.props.defaultImage)} />
        </div>
        {progressBar}
      </div>
    );
  }
});

module.exports = ImageInput;
