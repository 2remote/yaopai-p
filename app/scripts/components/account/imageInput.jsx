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
    uptoken_url: API.file_api.user_token_url,
    domain: 'http://qiniu-plupload.qiniudn.com/',
    auto_start: true,
    get_new_uptoken: true,
    init: {
            'FilesAdded': function(){},
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
      defaultImage : 'img/tianjia.png',
      colWidth : 'col-xs-4',
      type : '',  //必须指定图片类型 user, work...
      uid : 'imagePick', //当一个页面引用了多个ImageInput，必须指定不同的uid
    }
  },
  onFileUploaded : function(up,file,info){
    var res = JSON.parse(info);
    this.setState({imageUrl : res.Url});
  },

  getImage : function(){
    return this.state.imageUrl;
  },

  componentDidMount : function() {
    this.uploaderOption.browse_button = this.props.uid;
    this.uploaderOption.init.FileUploaded = this.onFileUploaded;
    this.uploader = Qiniu.uploader(this.uploaderOption);
  },
  
  render : function (){
    var img ;
    if(this.state.imageUrl != ''){
      img = (
        <img id={this.props.uid} className="image-button" width="150" heigth="150" src={this.state.imageUrl} onClick={this.showImage} />
      );
    }else{
      img = (
        <img id={this.props.uid} className="image-button" width="150" heigth="150" src={this.props.defaultImage} onClick={this.handleClick} />
      );
    }

    return (
      <div className={this.props.colWidth}>
        <div>
          {img}
        </div>
      </div>
    );
  }
});

module.exports = ImageInput;