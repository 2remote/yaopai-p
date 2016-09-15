import React, { PropTypes } from 'react'
import { History } from 'react-router'
import Reflux from 'reflux'
import InputGroup from 'components/upai/form/InputGroup'
import ImageOptimus from 'components/upai/ImageOptimus'
import ImageUploader from 'yaopai/ImageUploader'
import InfoHeader from 'components/infoHeader'
import TagList from 'yaopai/TagList'
import MoteAlbumAction from './MoteAlbumAction'
import { ROUTE_MAIN } from '../scripts/routeConfig'
import { MoteNotifyStore, MOTE_UPLOAD_ALBUM } from './MoteNotifyStore'

const MoteUpload = React.createClass({
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
        alert('上传失败！')
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
      <div style={{backgroundColor: '#fff',
        padding: '40px 60px 70px 60px',
        color: '#777777',}}>
        <InfoHeader
          infoTitle="模特作品上传"
          infoIconClass="glyphicon glyphicon-camera"
        />
        <form className="form-horizontal" onSubmit={this.props.handleSubmit}>

          {/* TODO: 一、title 标题 - required */}
          <InputGroup
            ref="title"
            label="标题" type="text"
            horizontalLabelStyle="col-xs-3"
            horizontalInputStyle="col-xs-6"
            value={this.props.title}
            updateValue={this.props.updateTitle}
            placeholder="不超过50个汉字"
            minLength="1"
            maxLength="50"
          />

          {/* TODO: 二、desc 描述 */}
          <InputGroup
            ref="description"
            label="描述" type="text"
            horizontalLabelStyle="col-xs-3"
            horizontalInputStyle="col-xs-6"
            value={this.props.desc}
            updateValue={this.props.updateDesc}
            placeholder="请输入模特描述文字,不超过100个汉字"
            minLength="1"
            maxLength="100"
          />

          {/* TODO: 三、cover 封面 - required */}
          <InputGroup
            label="封面" type="children"
            horizontalLabelStyle="col-xs-3"
            horizontalInputStyle="col-xs-6"
          >
            <ImageOptimus onUploadSucceed={this.props.updateCover} />
          </InputGroup>

          {/* TODO: 四、cut 封面裁剪函数 */}

          {/* TODO: 五、tags 标签 */}
          <InputGroup
            label="标签" type="children"
            horizontalLabelStyle="col-xs-3"
            horizontalInputStyle="col-xs-6"
          >
            <TagList
              type="mote" gutter={5} size="normal" maxCount={3}
              selectedTagIds={this.props.tags}
              onTagSelect={this.props.updateTags}
            />
          </InputGroup>

          {/* TODO: 六、photos 作品 - required */}
          <InputGroup
            label="作品" type="children"
            horizontalLabelStyle="col-xs-3"
            horizontalInputStyle="col-xs-6"
          >
            <ImageUploader
              onTagSelect={this.onPhotosChange}
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

MoteUpload.propTypes = {
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
}

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

  updatePhotos(photos) { console.log('photos', photos); this.setState({ photos }) },

  validate(){
    if(!this.state.title){
      alert('标题不能为空')
      return false;
    }
    if(!this.state.desc){
      alert('描述不能为空')
      return false;
    }
    if(this.state.cover===''){
      alert('封面不能为空')
      return false;
    }
    if(this.state.tags.length==0){
      alert('标签不能为空')
      return false;
    }
    if(this.state.photos.length==0){
      alert('作品图不能为空')
      return false;
    }
    return true
  },


  handleSubmit(e) {
    e && e.preventDefault && e.preventDefault()
    console.log('[formData]', this.state)
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
