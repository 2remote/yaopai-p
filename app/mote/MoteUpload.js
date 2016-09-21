import React, { PropTypes } from 'react'
import { History } from 'react-router'
import Reflux from 'reflux'
import InputGroup from 'components/upai/form/InputGroup'
import ImageOptimus from 'components/upai/ImageOptimus'
import ImageUploader from 'yaopai/ImageUploader'
import InfoHeader from 'components/infoHeader'
import TagList from 'yaopai/TagList'
import { ROUTE_MAIN } from 'util/routeConfig'
import alert from 'util/alert'
import MoteAlbumAction from './MoteAlbumAction'
import { MoteNotifyStore, MOTE_UPLOAD_ALBUM } from './MoteNotifyStore'

const MoteUpload = React.createClass({
  propTypes: {
    /* title */
    title: PropTypes.string,
    updateTitle: PropTypes.func.isRequired,
    /* desc */
    desc: PropTypes.string,
    updateDesc: PropTypes.func.isRequired,
    /* cover */
    updateCover: PropTypes.func.isRequired,
    /* tags */
    tags: PropTypes.list,
    updateTags: PropTypes.func.isRequired,
    /* photos */
    updatePhotos: PropTypes.func.isRequired,
    /* submit */
    handleSubmit: PropTypes.func.isRequired,
  },

  mixins: [Reflux.listenTo(MoteNotifyStore, 'onMoteNotify'), History],

  getInitialState() {
    return {
      tags: [],
      photos: [],
    }
  },

  onMoteNotify(notification) {
    const { source, success, msg } = notification
    if (source === MOTE_UPLOAD_ALBUM) {
      if (success) {
        alert('上传成功！')
        this.history.replaceState(null, ROUTE_MAIN)
      } else {
        alert(msg)
      }
    }
  },

  onTagSelect(tags) {
    this.setState({ tags })
  },

  onPhotosChange(photos) {
    this.setState({ photos })
  },

  render() {
    return (
      <div
        style={{
          backgroundColor: '#fff',
          padding: '40px 60px 70px 60px',
          color: '#777777',
        }}
      >
        <InfoHeader
          infoTitle="模特作品上传"
          infoIconClass="glyphicon glyphicon-camera"
        />
        <form className="form-horizontal" onSubmit={this.props.handleSubmit}>

          {/* TODO: 一、title 标题 - required */}
          <InputGroup
            label="标题"
            type="text"
            horizontalLabelStyle="col-xs-3"
            horizontalInputStyle="col-xs-6"
            value={this.props.title}
            updateValue={this.props.updateTitle}
            placeholder="2到30个字"
            hasFeedback
            minLength={2}
            maxLength={30}
          />

          {/* TODO: 二、desc 描述 */}
          <InputGroup
            label="描述"
            type="text"
            horizontalLabelStyle="col-xs-3"
            horizontalInputStyle="col-xs-6"
            value={this.props.desc}
            updateValue={this.props.updateDesc}
            placeholder="请输入模特描述文字，5到200个汉字"
            hasFeedback
            minLength={5}
            maxLength={200}
          />

          {/* TODO: 三、cover 封面 - required */}
          <InputGroup
            label="封面"
            type="children"
            horizontalLabelStyle="col-xs-3"
            horizontalInputStyle="col-xs-6"
          >
            <ImageOptimus onUploadSucceed={this.props.updateCover} />
          </InputGroup>

          {/* TODO: 四、cut 封面裁剪函数 */}

          {/* TODO: 五、tags 标签 */}
          <InputGroup
            label="标签"
            type="children"
            horizontalLabelStyle="col-xs-3"
            horizontalInputStyle="col-xs-6"
          >
            <TagList
              type="mote"
              gutter={5}
              size="normal"
              maxCount={3}
              selectedTagIds={this.props.tags}
              onTagSelect={this.props.updateTags}
            />
          </InputGroup>

          {/* TODO: 六、photos 作品 - required */}
          <InputGroup
            label="作品"
            type="children"
            horizontalLabelStyle="col-xs-3"
            horizontalInputStyle="col-xs-6"
          >
            <ImageUploader
              maxCount={5}
              onPhotosChange={this.props.updatePhotos}
            />
          </InputGroup>

          {/* 七、提交按钮 */}
          <InputGroup
            type="children"
            horizontalLabelStyle="col-xs-3"
            horizontalInputStyle="col-xs-6"
          >
            <button type="submit" className="btn btn-lg btn-primary">提交</button>
          </InputGroup>
        </form>
      </div>
    )
  },
})

const MoteUploadContainer = React.createClass({
  getInitialState() {
    return {
      title: undefined,
      desc: undefined,
      cover: '',
      tags: [],
      photos: [],
    }
  },

  updateTitle(title) { this.setState({ title }) },

  updateDesc(desc) { this.setState({ desc }) },

  updateCover(cover) { this.setState({ cover }) },

  updateTags(tags) { this.setState({ tags }) },

  updatePhotos(photos) { this.setState({ photos }) },

  validate() {
    const { title, desc, cover, tags, photos } = this.state
    /* title [2, 30] */
    if (!title) {
      alert('标题不能为空')
      return false
    }
    if (title.length < 2 || title.length > 30) {
      alert('标题长度需在2到30个字之间')
      return false
    }
    /* desc: [5, 200] */
    if (!desc) {
      alert('描述不能为空')
      return false
    }
    if (desc.length < 5 || desc.length > 200) {
      alert('描述长度需在5到200字之间')
      return false
    }
    /* cover */
    if (!cover) {
      alert('封面不能为空')
      return false
    }
    /* tags: [1, 3] */
    if (tags.length < 1 || tags.length > 3) {
      alert('请选择1到3个标签')
      return false
    }
    /* photos: TODO: */
    if (photos.length === 0) {
      alert('作品图不能为空')
      return false
    }
    return true
  },


  handleSubmit(e) {
    e && e.preventDefault && e.preventDefault()
    if(this.validate()){
      MoteAlbumAction.add(this.state)
    }

  },

  render() {
    return (
      <MoteUpload
        title={this.state.title}
        updateTitle={this.updateTitle}
        desc={this.state.desc}
        updateDesc={this.updateDesc}
        updateCover={this.updateCover}
        tags={this.state.tags}
        updateTags={this.updateTags}
        updatePhotos={this.updatePhotos}
        handleSubmit={this.handleSubmit}
      />
    )
  },
})

export default MoteUploadContainer
