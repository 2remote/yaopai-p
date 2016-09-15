import React, { PropTypes } from 'react'
import { History } from 'react-router'
import Reflux from 'reflux'
import InputGroup from 'components/upai/form/InputGroup'
import ImageOptimus from 'components/upai/ImageOptimus'
import ImageUploader from '../scripts/temp/ImageUploader'
import TagList from '../scripts/common/TagList'
import InfoHeader from 'components/infoHeader'
import MaAlbumAction from './MaAlbumAction'
import { ROUTE_MAIN } from '../scripts/routeConfig'
import { MaNotifyStore, MA_UPLOAD_ALBUM } from './MaNotifyStore'

const MaUpload = React.createClass({
  mixins: [Reflux.listenTo(MaNotifyStore, 'onMaNotify'), History],

  getInitialState() {
    return {
      tags: [],
      photos: [],
    }
  },

  onMaNotify(notification) {
    const { source, success, msg} = notification
    if (source === MA_UPLOAD_ALBUM) {
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
          infoTitle="化妆师作品上传"
          infoIconClass="glyphicon glyphicon-camera"
        />
      <form className="form-horizontal" onSubmit={this.props.handleSubmit}>
        {/* TODO: 一、title 标题 - required */}
        <InputGroup
          label="标题" type="text"
          horizontalLabelStyle="col-xs-3"
          horizontalInputStyle="col-xs-6"
          hasFeedback
          placeholder="不超过50个汉字"
          minLength={1}
          maxLength={50}
          required
          value={this.props.title}
          updateValue={this.props.updateTitle}
        />

        {/* TODO: 二、desc 描述 */}
        <InputGroup
          label="描述" type="text"
          horizontalLabelStyle="col-xs-3"
          horizontalInputStyle="col-xs-6"
          value={this.props.desc}
          updateValue={this.props.updateDesc}
          placeholder="不超过100个汉字"
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
            type="ma" gutter={5} size="normal" maxCount={3}
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

MaUpload.propTypes = {
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

const MaUploadContainer = React.createClass({
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
      MaAlbumAction.add(this.state)
    }
  },

  render() {
    return (
      <MaUpload
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

export default MaUploadContainer
