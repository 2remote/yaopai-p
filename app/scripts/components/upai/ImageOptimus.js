import React from 'react'
import Reflux from 'reflux'
import { FILE } from 'util/api'
import UserAccountStore from '../../stores/UserAccountStore'
import { ProgressBar } from 'react-bootstrap'
import tianjiaImg from 'image/tianjia.png'

/**
 * // TODO: 回头我把下面的解释换成中文
 *
 * How this works:
 * √ 1. Use plupload to handle the file-choosing interface
 * √ 2. When user chooses a file through plupload, the file is handed to cropperjs for display and to crop
 * √ 3. User clicks submit, now the cropped image should be handed back to plupload
 * √ 4. Plupload uploads the cropped image to Qiniu's server
 * The plupload plugin here is integrated with Qiniu's upload service, provided by their officials.
 *
 * Note: Qiniu's plupload initialization requires user login for uptoken_url config, without it, nothing
 * will be initialized.
 *
 * P.S. I name this component after Optimus Prime for the reason that:
 * There are ALWAYS times when the component needs to do MORE. It deserves such a FXXKING AWESOME name!
 *
**/
const ImageOptimus = React.createClass({
  getInitialState() {
    return {
      progress: 0,
    }
  },
  /**
   * Render放最上面，方便改
  **/
  render() {
    return (
      <div style={{ marginBottom: 10 }}>
        <div style={{width:'400px'}}>
          {/* Cropperjs要求img放在一个block级别的容器里，方便加载裁剪界面 */}
          <div>
            <img ref="cropper" src={ this.state.file } style={{ maxWidth: '100%' }} />
          </div>
          {this.state.progress ?
            <ProgressBar
              now={ this.state.progress }
              label={ this.state.progress+'%' }
            />
            : null
          }
        </div>
        {/* Two functional buttons */}
        <div>
          <img ref="uploader" className="image-button" width="140" src={tianjiaImg} /><button type="button" ref="upload" style={{display:this.state.file?'inline-block':'none'}} onClick={ this.doUpload } className="btn btn-primary">确认裁剪</button>
        </div>

        {/* 裁剪结果预览，可删除 */}
        {/* <div>
          <img ref="croppedImage" src={ this.state.croppedImage } style={{ maxWidth: '100%' }} />
        </div> */}
        {/* 上传成功的返回url图片，可删除 */}
        {/* <div>
          <img src={ this.state.uploadedImage } style={{ maxWidth: '100%' }} />
        </div> */}
      </div>
    )
  },

  cropper: undefined,
  isFileNew: false,
  uploader: undefined,
  mixins: [Reflux.connect(UserAccountStore, 'user'), Reflux.listenTo(UserAccountStore, 'onUserUpdate')],

  /**
   * componentDidMount和onUserUpdate负责使用sessionToken来初始化uploader
  **/
  componentDidMount() {
    this.initUploader()
  },

  onUserUpdate(user) {
    if(user.sessionToken) {
      this.initUploader()
    }
  },

  /**
   * Cropperjs只能在DOM上有img的时候才能加载，所以它的初始化逻辑是：
   * 1. Plupload加载数据之后调用FilesAdded的回调，设置state中的file
   * 2. react走生命周期的render，把file显示在<img>里
   * 3. 这里，componentDidUpdate的时候才初始化cropper
   * 4. cropper可能是初始化也可能是换个图片重新加载，所以这里命名叫load
  **/
  componentDidUpdate() {
    this.loadCropper()
  },

  initUploader() {
    const self = this
    const { sessionToken } = self.state.user
    if(sessionToken && !self.uploader) {
      self.uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4', // 上传模式，依次退化 TODO: 如果cropper必须用File API，是不是flash什么的可以删了？
        browse_button: self.refs.uploader.getDOMNode(),
        uptoken_url: FILE.work_token_url +'&tokenid=' + sessionToken,
        get_new_uptoken: true,
        domain: 'http://qiniu-plupload.qiniudn.com/',     // bucket域名，下载资源时用到，必需
        max_file_size: '10mb', // 最大文件体积限制
        flash_swf_url: 'vendor/Moxie.swf', //引入flash，相对路径
        max_retries: 3, // 上传失败最大重试次数
        chunk_size: '4mb', // 分块上传时，每块的体积，七牛要求必须4mb
        auto_start: false, // 需要裁剪，关闭自动上传
        multi_selection: false, // 文件选择框是否支持多选
        filters : {
          max_file_size: '10mb',
          mime_types: [
            { title: "Image files", extensions: "jpg,png,jpeg" }, // 限定jpg,png后缀上传
          ]
        },
        init: {
          FilesAdded: function(up, files) {
            if(self.isUploadFile) {
              return
            }
            React.findDOMNode(self.refs.upload).style.display="inline-block"
            // 取最后一个文件
            const rawFiles = up.files
            self.rawId = rawFiles[rawFiles.length - 1].id
            // 读取文件
            const reader  = new FileReader()
            reader.addEventListener("load", function () {
              self.isFileNew = true
              self.setState({
                file: reader.result,
              })
            }, false)
            reader.readAsDataURL(up.getFile(self.rawId).getNative())
          },
          BeforeUpload: function(up, file) {
            if(file.origSize >= 1024 * 1024) { // 压缩
              up.setOption('resize', { width: 1125, height: 2208, enabled: true, quality: 90})
            } else { // 那就不压缩了
              up.setOption('resize', false)
            }
          },
          UploadProgress: function(up, file) {
            // 每个文件上传时，处理相关的事情
            self.setState({ progress: file.percent })
          },
          FileUploaded: function(up, file, info) {
            // 每个文件上传成功后，处理相关的事情
            // 其中info是文件上传成功后，服务端返回的json，形式如：
            // {
            //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
            //    "key": "gogopher.jpg"
            //  }
            // 查看简单反馈
            var domain = up.getOption('domain')
            var res = JSON.parse(info)
            var sourceLink = domain + res.key // 获取上传成功后的文件的Url
            self.cleanUp()
            self.setState({
              uploadedImage: res.Url,
              file: res.Url,
              progress: 0,
            })
            // 传结果给回调
            self.props.onUploadSucceed && self.props.onUploadSucceed(res.Url)
          },
          Error: function(up, err, errTip) {
            // TODO: 这段代码来源于imageInput，临时放这里，处理Error的时候参考
            // if(this.props.onError) {
            //   var max_file_size = plupload.parseSize('10mb');
            //   if(err.file.size > max_file_size){
            //     this.props.onError('您上传的图片大于 10 M，请压缩后再上传');
            //   }else{
            //     if(err.code == -601){
            //       this.props.onError('图片格式错误');
            //     }else{
            //       this.props.onError(err.message);
            //     }
            //   }
            // }
          },
          UploadComplete: function() { },
        }
      })
    } else {
      console.warn('Uploader requires a user sessionToken to initialize!')
    }
  },

  loadCropper() {
    const self = this

    // 新文件来了，重新加载cropper
    if(this.state.file && this.isFileNew) {
      self.isFileNew = false
      if(self.cropper) {
        self.cropper.replace(this.state.file)
      } else {
        self.cropper = new Cropper(self.refs.cropper.getDOMNode(), {
          aspectRatio: 3 / 2,
          zoomOnWheel: false,
          cropend: function(e) {
            self.setState({
              croppedImage: self.cropper.getCroppedCanvas().toDataURL(),
            })
          },
        })
      }
    }
  },

  /**
   * 处理文件上传（到七牛）
  **/
  doUpload() {
    const self = this
    if(self.uploader) {
      self.cropper.getCroppedCanvas().toBlob(function(blob) {
        if (blob.size > 4000000) {
          alert('文件尺寸过大，裁剪君做不到啊ಥ_ಥ！！请缩小宽度/高度后再裁剪')
        } else {
          // 清空上传列表，就是这么霸道
          self.uploader.splice()
          // 添加裁剪过的图片
          self.isUploadFile = true
          self.uploader.addFile(blob)
          // 开始上传
          self.uploader.start()
          React.findDOMNode(self.refs.upload).style.display="none"
        }
      })
    }
  },

  cleanUp() {
    // 清空上传列表
    this.uploader && this.uploader.splice()
    // 清除正在上传标识
    this.isUploadFile = false
    // 关闭cropper
    this.cropper && this.cropper.destroy()
  },

})

export default ImageOptimus
