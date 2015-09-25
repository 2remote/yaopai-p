var React = require('react');
var Reflux = require('reflux');
var Panel = require('react-bootstrap').Panel;
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;

var UploadTokenStore = require('../stores/UploadTokenStore');
var UploadActions = require('../actions/UploadActions');

var InfoHeader = React.createClass({
  render : function(){
    return (
      <div className="row">
        <div className="col-sm-8">
          <span><h3>个人信息</h3></span>
        </div>
        <div className="line">
        </div>
      </div>
      )
  }
});

var TextInput = React.createClass({
  getDefaultProps : function(){
    return{
      textClassName : 'col-sm-4',
      validatedClass : ''
    }
  },
  render : function(){
    return (
      <Input type="text" 
        bsStyle={this.props.validatedClass} 
        label={this.props.labelName} 
        placeholder={this.props.placeholderName} 
        labelClassName='col-xs-2' 
        wrapperClassName={this.props.textClassName}
        hasFeedback />
      );
  }
});

var UserImage = React.createClass({
  mixins: [Reflux.listenTo(UploadTokenStore, 'onGetToken')],
  uploaderOption : {
    runtimes: 'html5,flash,html4',    //上传模式,依次退化
    browse_button: 'uploadAvator',       //上传选择的点选按钮，**必需**
    uptoken: UploadTokenStore.tokens['user'],//在action里设置token
        //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
    // uptoken : '<Your upload token>',
        //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
    // unique_names: true,
        // 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
    // save_key: true,
        // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
    domain: 'http://qiniu-plupload.qiniudn.com/',
        //bucket 域名，下载资源时用到，**必需**
    container: 'uploadAvatorC',           //上传区域DOM ID，默认是browser_button的父元素，
    max_file_size: '100mb',           //最大文件体积限制
    flash_swf_url: 'vendor/Moxie.swf',  //引入flash,相对路径
    max_retries: 3,                   //上传失败最大重试次数
    dragdrop: true,                   //开启可拖曳上传
    drop_element: 'uploadAvatorC',        //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
    chunk_size: '4mb',                //分块上传时，每片的体积
    auto_start: true,                 //选择文件后自动上传，若关闭需要自己绑定事件触发上传
    init: {
        'FilesAdded': function(up, files) {
            plupload.each(files, function(file) {
                // 文件添加进队列后,处理相关的事情
                console.log(file);
            });
        },
        'BeforeUpload': function(up, file) {
               // 每个文件上传前,处理相关的事情
        },
        'UploadProgress': function(up, file) {
               // 每个文件上传时,处理相关的事情
        },
        'FileUploaded': function(up, file, info) {
               // 每个文件上传成功后,处理相关的事情
               // 其中 info 是文件上传成功后，服务端返回的json，形式如
               // {
               //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
               //    "key": "gogopher.jpg"
               //  }
               // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
              var res = eval('('+info+')');
              var sourceLink = res.Url; //获取上传成功后的文件的Url
              console.log(sourceLink);
        },
        'Error': function(up, err, errTip) {
               //上传出错时,处理相关的事情
        },
        'UploadComplete': function() {
               //队列文件处理完毕后,处理相关的事情
        },
        'Key': function(up, file) {
            // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
            // 该配置必须要在 unique_names: false , save_key: false 时才生效
            var key = "";
            // do something with key here
            return key
        }
      }
  },
  uploader : {},
  componentDidMount : function(){
    
    if(this.uploaderOption.uptoken && this.uploaderOption.uptoken !=''){
      this.uploader = Qiniu.uploader(this.uploaderOption);
    }else{
      UploadActions.getToken({type:'user'});
    }
  },
  onGetToken : function (data) {
    console.log(data);
    if(data['user'] && data['user'] != ''){
      this.uploaderOption.uptoken = data['user'];
      this.uploader = Qiniu.uploader(this.uploaderOption);
    }else{
      console.log('没有拿到token');
    }
  },
  render : function() {
    return (
        <div className="form-group">
          <label className="control-label col-xs-2">头像：</label>
          <div id="uploadAvatorC" className="col-xs-4">
            <img id="uploadAvator" height="75" src="img/default_user_img.png" />
          </div>
        </div>
      );
  }

});

var UserGender = React.createClass({
  render : function  () {
    return (
      <div className="form-group">
        <label className="control-label col-xs-2">性别：</label>
        <div className="col-xs-4">
          <Button>男</Button>
          <Button>女</Button>
        </div>
      </div>
      );
  }

});

var District = React.createClass({
  render : function () {
    return (
      <Input type="select" 
        label="地区：" 
        placeholder={this.props.placeholderName} 
        labelClassName='col-xs-2' 
        wrapperClassName='col-xs-4'
        hasFeedback />
      );
  }

});

var PersonInfo = React.createClass({

  render: function() {

    return (
      <Panel>
        <form className='form-horizontal'>
          <InfoHeader />
          <UserImage />
          <TextInput labelName="昵称：" />
          <UserGender />
          <District />
          <button className="btn btn-primary">保存</button>
        </form>
      </Panel>
    );
  }
});

module.exports = PersonInfo;
