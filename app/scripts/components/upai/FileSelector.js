import React, { PropTypes } from 'react'

const FileSelector = React.createClass({
  onChange(e) {
    e && e.preventDefault && e.preventDefault()
  },

  render() {
    const { types } = this.props
    return (
      <input ref="fileInput" type="file" onChange={this.onChange} />
    )
  },
})

FileSelector.propTypes = {
  types: PropTypes.arrayOf(PropTypes.string),
}

export default FileSelector
