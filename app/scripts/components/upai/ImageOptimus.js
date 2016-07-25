import React from 'react'
import Reflux from 'reflux'
import { FILE } from '../../api'
import UserAccountStore from '../../stores/UserAccountStore'

/**
 * TODO: Ok, here is how this works:
 * √ 1. Render this component with a button/DOM element
 * √ 2. After rendering that, initialize plupload to take files from the button or sth
 * √ 3. Initialize cropperjs to use the file passed to it through plupload
 * √ 4. Now cropperjs should be able to track user's croping action
 * √ 5. When the user submits the image, it should be processed (cropped by cropperjs or so)
 *    and then passed somewhere as a binary file
 * √ 6. Now initialize QiNiu's upload utility to upload this image (using some low level uploading api, of course).
 *
 * Ok, after thousands of times experimenting, dubugging, and reading, the workflow is now clear:
 *
 * √ 1. Use plupload to handle the file-choosing interface
 * √ 2. When user chooses a file through plupload, the file is handed to cropperjs for display and to crop
 * √ 3. User clicks submit, now the cropped image should be handed back to plupload
 * √ 4. Plupload uploads the cropped image to Qiniu's server
 *
 * The plupload plugin here is integrated with Qiniu's upload service, provided by their officials.
 *
 *
 * P.S. I name this component after Optimus Prime for the reason that:
 *
 * ---> There are ALWAYS times when the component needs to do MORE. It deserves such a FXXKING AWESOME name!
 *
**/
const ImageOptimus = React.createClass({
  /**
   * Render放最上面，方便改
  **/
  render() {
    return (
      <div>
        <p>
          操作指南：<br />
          <ol>
            <li>点击“初始化”</li>
            <li>点击“点我试试”</li>
            <li>选图片文件</li>
            <li>在剪裁区域象征性拖动几下（你不拖动几下，后面会出bug. 其实这些步骤漏哪个都可能bug，不漏也不保证没bug）</li>
            <li>意思意思行了，点击“牛牛牛”</li>
            <li>坐等。</li>
          </ol>
          结果怎么看：最后的上传结果会回显到最下面。或者用开发者工具自己看回包。
        </p>
        <button ref="uploader" className="btn btn-default">点我试试</button>
        <button type="button" onClick={ this.initUploader } className="btn btn-default">初始化</button>
        <button type="button" onClick={ this.cow } className="btn btn-default">牛牛牛</button>
        <div>
          <img ref="cropper" src={ this.state.file } style={{ maxWidth: '100%' }} />
        </div>
        <div>
          <img ref="croppedImage" src={ this.state.croppedImage } style={{ maxWidth: '100%' }} />
        </div>
        <hr />
        <div>
          <img src={ this.state.uploadedImage } style={{ maxWidth: '100%' }} />
        </div>
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
   * 4. cropper可能是初始化也可能是换个图片重新加载，所以这里命名用了load
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
        uptoken_url: FILE.user_token_url +'&tokenid=' + sessionToken,
        get_new_uptoken: true,
        domain: 'http://qiniu-plupload.qiniudn.com/',     // bucket域名，下载资源时用到，必需
        max_file_size: '10mb', // 最大文件体积限制
        flash_swf_url: 'vendor/Moxie.swf', //引入flash，相对路径
        max_retries: 3, // 上传失败最大重试次数
        chunk_size: '4mb', // 分块上传时，每块的体积，七牛要求必须4mb
        auto_start: false, // 需要裁剪，关闭自动上传
        multi_selection: true, // 文件选择框是否支持多选
        filters : {
          max_file_size: '10mb',
          mime_types: [
            {title : "Image files", extensions : "jpg,png,jpeg"}, // 限定jpg,png后缀上传
          ]
        },
        init: {
          FilesAdded: function(up, files) {
            // 取最后一个文件
            const rawFiles = self.uploader.files
            self.rawId = rawFiles[rawFiles.length - 1].id
            // 读取文件
            const reader  = new FileReader()
            reader.addEventListener("load", function () {
              self.isFileNew = true
              self.setState({
                file: reader.result,
              })
            }, false)
            reader.readAsDataURL(self.uploader.getFile(self.rawId).getNative())
          },
          UploadProgress: function(up, file) {
            // 每个文件上传时，处理相关的事情
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
            self.setState({
              uploadedImage: res.Url,
            })
            // 传结果给回调
            this.props.onUploadSucceed && this.props.onUploadSucceed(res.Url)
          },
          Error: function(up, err, errTip) { },
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
  cow() {
    const self = this
    if(self.uploader) {
      // 清空上传列表，就是这么霸道
      self.uploader.splice()
      self.cropper.getCroppedCanvas().toBlob(function(blob) {
        // 添加裁剪过的图片
        self.uploader.addFile(blob)
        // 开始上传
        self.uploader.start()
      })
    }
  },
})

export default ImageOptimus
