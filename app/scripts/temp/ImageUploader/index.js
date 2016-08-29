/**
 * ImageUploader是临时使用的基于七牛上传组件的多图上传组件
 * 本组件是对 components/account/chooseImage 的改进版
 * @since 2016-08-27
 *
**/
import React, { PropTypes } from 'react'
import Reflux from 'reflux'

import { FILE } from '../../api'
import ImageItem from './ImageItem'
import UserAccountStore from '../../stores/UserAccountStore'

const ImageUploader = React.createClass({
  mixins: [Reflux.connect(UserAccountStore, 'user'), Reflux.listenTo(UserAccountStore, 'onUserUpdate')],

  onUserUpdate(user) {
    if(user.sessionToken) {
      this.initUploader()
    }
  },

  getInitialState() {
    return {
      photos: [],
    }
  },

  componentDidMount() {
    this.initUploader()
  },

  notifyPhotos() {
    if (this.props.onPhotosChange) {
      const successPhotos = _.filter(this.state.photos, photo => photo.url)
      this.props.onPhotosChange(successPhotos.map(photo => photo.url))
    }
  },

  /**
   * file should contain these properties:
   * id
   * progress
   * url
  **/
  updateFiles(file) {
    const newFileList = [_.pick(file, ['id', 'percent', 'url'])]
    let photos = _.unionBy(newFileList, this.state.photos, 'id')
    const max = this.props.maxCount || 0
    if (max > 0) {
      photos = _.take(photos, this.props.maxCount)
    }
    this.setState({ photos })
    this.notifyPhotos()
  },

  doMoveItemUp(id) {
    const photos = _.cloneDeep(this.state.photos)
    const idx = _.findIndex(photos, photo => photo.id === id)
    if (idx > 0) {
      // 操纵索引的swap，一点都不FP
      const target = photos[idx - 1]
      photos[idx - 1] = photos[idx]
      photos[idx] = target
      this.setState({ photos })
      this.notifyPhotos()
    }
  },

  doMoveItemDown(id) {
    const photos = _.cloneDeep(this.state.photos)
    const idx = _.findIndex(photos, photo => photo.id === id)
    if (idx < photos.length - 1 && idx >= 0) {
      // 操纵索引的swap，一点都不FP
      const target = photos[idx + 1]
      photos[idx + 1] = photos[idx]
      photos[idx] = target
      this.setState({ photos })
      this.notifyPhotos()
    }
  },

  doDeleteItem(id) {
    const photos = _.cloneDeep(this.state.photos)
    _.remove(photos, photo => photo.id === id)
    this.setState({ photos })
    this.notifyPhotos()
  },

  onDescChange(id, desc) {
    const photos = _.cloneDeep(this.state.photos)
    const idx = _.findIndex(photos, photo => photo.id === id)
    photos[idx].desc = desc
    this.setState({ photos })
    this.notifyPhotos()
  },

  render() {
    const max = this.props.maxCount || 0
    let uploaderDisplay = null
    if (max > 0 && this.state.photos.length >= max) {
      uploaderDisplay = 'none'
    }

    return (
      <div className="row">
        <div className="col-xs-12" style={{ display: uploaderDisplay }}>
          <img ref="uploader" className="image-button" width="140" src="img/tianjia.png" />
        </div>
        <div className="col-xs-12">
          {
            this.state.photos.map(photo => (
              <ImageItem
                id={photo.id}
                percent={photo.percent}
                url={photo.url}
                doMoveItemUp={this.doMoveItemUp}
                doMoveItemDown={this.doMoveItemDown}
                doDeleteItem={this.doDeleteItem}
                onDescChange={this.onDescChange}
              />
            ))
          }
        </div>
      </div>
    )
  },

  initUploader() {
    const self = this
    const { sessionToken } = self.state.user
    if(sessionToken && !self.uploader) {
      console.log("type==========",FILE.work_token_url);
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
        auto_start: true,
        multi_selection: true, // 文件选择框是否支持多选
        filters : {
          max_file_size: '10mb',
          mime_types: [
            { title: "Image files", extensions: "jpg,png,jpeg" }, // 限定jpg,png后缀上传
          ]
        },
        init: {
          FilesAdded: function(up, files) {
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
            console.log('file progress', file)
            self.updateFiles(file)
            // self.setState({ progress: file.percent })
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
            console.log('setting image:', res.Url)
            console.log('uploadedFile', file)
            console.log('uploadedInfo', info)
            // self.cleanUp()
            // self.setState({
            //   uploadedImage: res.Url,
            //   file: res.Url,
            //   progress: 0,
            // })
            self.updateFiles(_.merge(file, { url: res.Url }))
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
})

ImageUploader.propTypes = {
  maxCount: PropTypes.number,
  onPhotosChange: PropTypes.func,
}

export default ImageUploader
