var React = require ('react');
var API = require('../../api');

var ImageInput = React.createClass({
  uploader : {},  //七牛上传对象
  uploaderOption : {
    runtimes: 'html5,flash,html4',
    browse_button: '',
    max_file_size: '10mb',
    flash_swf_url: 'vendor/Moxie.swf',
    dragdrop: false,
    chunk_size: '4mb',
    uptoken_url: API.FILE.user_token_url,
    domain: 'http://qiniu-plupload.qiniudn.com/',
    auto_start: true,
    get_new_uptoken: true,
    init: {
            'FilesAdded': function(up,files){},
            'BeforeUpload': function(up, file) {},
            'UploadProgress': function(up, file) {},
            'UploadComplete': function() {},
            'FileUploaded': function(up, file, info) {},
            'Error': function(up, err, errTip) {}
        }
  },
  getInitialState : function(){
    return {
      imageUrl : ''
    }
  },
  getDefaultProps : function(){
    return {
      disabled : false,
      defaultImage : 'img/tianjia.png', //指定未上传时的图片
      colWidth : 'col-xs-4',  //指定所占列宽
      width : '150',  //图片高度
      height : '150', //指定图片高度
      type : '',  //必须指定图片类型 user, work...
      uid : 'imagePick', //当一个页面引用了多个ImageInput，必须指定不同的uid
      onUpload : function(data){},  //上传成功后回调函数
      onFileUploaded : function(up, file, info){}
    }
  },
  onFileUploaded : function(up,file,info){
    var res = JSON.parse(info);
    this.setState({imageUrl : res.Url});
    this.props.onUpload(res.Url); //上传成功后可以回调onUpload函数
  },

  getValue : function(){
    return this.props.defaultImage;
  },

  componentDidMount : function() {
    if(!this.props.disabled){
      this.uploaderOption.browse_button = this.props.uid;
      this.uploaderOption.init.FileUploaded = this.onFileUploaded;
      this.uploader = Qiniu.uploader(this.uploaderOption);
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
    return (
      <div style={this.props.addStyle} className={this.props.colWidth}>
        <div style={this.props.disabled?hide:{}}>
          <img id={this.props.uid}
            style={this.props.disabled? hide : imgStyle}
            width={this.props.width}
            height={this.props.height}
            src={this.parseImageUrl(this.props.defaultImage)} />
        </div>
        <div style={this.props.disabled? {} : hide}>
          <img
            style={this.props.disabled? noStyle : hide}
            width={this.props.width}
            height={this.props.height}
            src={this.parseImageUrl(this.props.defaultImage)} />
        </div>
      </div>
    );
  }
});

module.exports = ImageInput;