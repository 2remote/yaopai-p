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
  mixins: [Reflux.connect(UserAccountStore, 'user')],
  uploader: undefined,
  cropper: undefined,
  isFileNew: false,
  getInitialState() {
    return {}
  },
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
  /**
   * Should initialize plupload here. (AFTER the component has mounted)
  **/
  componentDidMount() {
    // this.initUploader()
  },
  componentDidUpdate() {
    this.loadCropper()
  },
  initUploader() {
    const self = this
    const { sessionToken } = self.state.user
    if(sessionToken) {
      self.uploader = Qiniu.uploader({
        runtimes: 'html5,flash,html4',      // 上传模式，依次退化
        browse_button: self.refs.uploader.getDOMNode(),         // 上传选择的点选按钮，必需
        uptoken_url: FILE.user_token_url +'&tokenid=' + sessionToken, // TODO:
        get_new_uptoken: true,             // 设置上传文件的时候是否每次都重新获取新的uptoken
        // Ajax请求downToken的Url，私有空间时使用，JS-SDK将向该地址POST文件的key和domain，服务端返回的JSON必须包含url字段，url值为该文件的下载地址
        domain: 'http://qiniu-plupload.qiniudn.com/',     // bucket域名，下载资源时用到，必需
        // container: 'container',             // 上传区域DOM ID，默认是browser_button的父元素
        max_file_size: '10mb',             // 最大文件体积限制
        flash_swf_url: 'vendor/Moxie.swf',  //引入flash，相对路径
        max_retries: 3,                     // 上传失败最大重试次数
        chunk_size: '4mb',                  // 分块上传时，每块的体积
        auto_start: false,                   // 选择文件后自动上传，若关闭需要自己绑定事件触发上传
        multi_selection: true,
        filters : {
          max_file_size: '10mb',
          mime_types: [
            {title : "Image files", extensions : "jpg,png,jpeg"}, // 限定jpg,png后缀上传
          ]
        },
        // Resize images on clientside if we can
        // resize: {
        //   width : 200,
        //   height : 200,
        //   quality : 90,
        //   crop: true // crop to exact dimensions
        // },
        init: {
          FilesAdded: function(up, files) {
            console.log('FilesAdded', files)
            self.rawId = files[0].id
            const reader  = new FileReader()
            reader.addEventListener("load", function () {
              self.isFileNew = true
              self.setState({
                file: reader.result,
              })
            }, false)
            reader.readAsDataURL(files[0].getNative())
          },
          BeforeUpload: function(up, file) {
            // 每个文件上传前，处理相关的事情
            console.log('uploading file:', file)
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
            var domain = up.getOption('domain');
            var res = JSON.parse(info);
            var sourceLink = domain + res.key; // 获取上传成功后的文件的Url
            self.setState({
              uploadedImage: res.Url,
            })
          },
          Error: function(up, err, errTip) {
            //上传出错时，处理相关的事情
          },
          UploadComplete: function() {
            //队列文件处理完毕后，处理相关的事情
          },
          Key: function(up, file) {
            // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
            // 该配置必须要在unique_names: false，save_key: false时才生效
            var key = "";
            // do something with key here
            return key
          }
        }
      })
      window.ur = this.uploader
      // domain为七牛空间对应的域名，选择某个空间后，可通过 空间设置->基本设置->域名设置 查看获取
      // uploader为一个plupload对象，继承了所有plupload的方法
    } else {
      console.warn('Uploader requires a user sessionToken to initialize!')
    }
  },
  loadCropper() {
    const self = this
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
      console.log('rawId', self.rawId)
      self.uploader.removeFile(self.rawId)
      var croppedFile
      self.cropper.getCroppedCanvas().toBlob(function(blob) {
        console.log('[croppedFile]', blob)
        self.uploader.addFile(blob)
        self.uploader.start()
      })
    }
  },
})

export default ImageOptimus
