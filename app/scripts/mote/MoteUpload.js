import React, { PropTypes } from 'react'
import InputGroup from '../components/upai/form/InputGroup'
import ImageOptimus from '../components/upai/ImageOptimus'
import ImageUploader from '../temp/ImageUploader'
import TagList from '../common/TagList'

const MoteUpload = React.createClass({
  getInitialState() {
    return {
      tags: [],
      photos: [],
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
      <form className="form-horizontal" onSubmit={this.props.handleSubmit}>
        {/* TODO: 一、title 标题 - required */}
        <InputGroup
          label="标题" type="text"
          horizontalLabelStyle="col-xs-3"
          horizontalInputStyle="col-xs-6"
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
      title: '',
      desc: '',
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

  handleSubmit(e) {
    e && e.preventDefault && e.preventDefault()
    console.log('[formData]', this.state)
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
