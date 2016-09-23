import React, { PropTypes } from 'react'

const ImageItem = React.createClass({
  render() {
    const { id, url } = this.props
    const percent = this.props.percent || 0
    const doMoveItemUp = this.props.doMoveItemUp || (() => {})
    const doMoveItemDown = this.props.doMoveItemDown || (() => {})
    const doDeleteItem = this.props.doDeleteItem || (() => {})
    const onDescChange = this.props.onDescChange || (() => {})
    return (
      <div>
        <div className="image-item">
          <div className="move-button">
            <div className="icon-wrap">
              <span
                className="glyphicon glyphicon-triangle-top image-button"
                onClick={(e) => {
                  e && e.preventDefault && e.preventDefault()
                  doMoveItemUp(id)
                }}
              />
            </div>
            <div className="icon-wrap">
              <span
                className="glyphicon glyphicon-triangle-bottom image-button"
                onClick={(e) => {
                  e && e.preventDefault && e.preventDefault()
                  doMoveItemDown(id)
                }}
              />
            </div>
          </div>
          <div className="main-image">
            <img width="75" height="75" src={url} alt="上传图片"/>
          </div>
          <div className="main-des">
            <textarea
              type="textarea"
              className="col-xs-12"
              placeholder="照片描述"
              onChange={(e) => {
                e && e.preventDefault && e.preventDefault()
                onDescChange(id, e.target.value)
              }}
            />
          </div>
          <div className="delete-button">
            <div className="right-icon">
              <span
                className="glyphicon glyphicon-remove-circle image-button"
                style={{ color: '#b3b3b3', }}
                onClick={(e) => {
                  e && e.preventDefault && e.preventDefault()
                  doDeleteItem(id)
                }}
              >
                删除
              </span>
            </div>
          </div>
        </div>
        {/* 5. 进度条 */}
        <div>
          <div className="progress">
            <div
              className="progress-bar"
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin="0"
              aria-valuemax="100"
              style={{ width: `${percent}%` }}
            >
              {`${percent}%`}
            </div>
          </div>
        </div>
      </div>
    )
  },
})

ImageItem.propTypes = {
  id: PropTypes.string,
  percent: PropTypes.number,
  url: PropTypes.string,
  doMoveItemUp: PropTypes.func,
  doMoveItemDown: PropTypes.func,
  doDeleteItem: PropTypes.func,
  onDescChange: PropTypes.func,
}

export default ImageItem
