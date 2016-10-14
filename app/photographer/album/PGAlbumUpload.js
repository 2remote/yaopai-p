import React from 'react'
import InputGroup from 'components/upai/form/InputGroup'
import ImageOptimus from 'components/upai/ImageOptimus'
import ImageUploader from 'yaopai/ImageUploader'

/* eslint-disable react/prefer-es6-class, react/prefer-stateless-function */
const PGAlbumUpload = React.createClass({
  getInitialState() {
    return {
      // title: '',
      // cover: '',
      photos: [],
    }
  },

  submit() {
    console.log('submitting')
  },

  render() {
    const { submit } = this
    const { title } = this.state
    return (
      <div
        style={{
          backgroundColor: '#fff',
          padding: '40px 60px 70px 60px',
          color: '#777777',
        }}
      >
        <form className="form-horizontal" onSubmit={submit}>
          {/* 一、title */}
          <InputGroup
            label="标题"
            type="text"
            horizontalLabelStyle="col-xs-3"
            horizontalInputStyle="col-xs-6"
            value={title}
            updateValue={(val) => this.setState({ title: val })}
            placeholder="2到30个字"
            hasFeedback
            minLength={2}
            maxLength={30}
          />
          {/* 三、cover 封面 */}
          <InputGroup
            label="封面"
            type="children"
            horizontalLabelStyle="col-xs-3"
            horizontalInputStyle="col-xs-6"
          >
            <ImageOptimus onUploadSucceed={(val) => this.setState({ cover: val })} />
          </InputGroup>
          {/* 六、photos 作品 */}
          <InputGroup
            label="作品"
            type="children"
            horizontalLabelStyle="col-xs-3"
            horizontalInputStyle="col-xs-6"
          >
            <ImageUploader
              maxCount={30}
              onPhotosChange={(val) => this.setState({ photos: val })}
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

export default PGAlbumUpload
