import React, { PropTypes } from 'react'

import TagListAction from './TagListAction'

const TagList = React.createClass({
  render: () => {
    const { size, list } = this.props
    return (
      <div>
        {
          list.map(tag => (
            <button className="btn">{tag.name}</button>
          ))
        }
      </div>
    )
  },
})

TagList.propTypes = {
  size: PropTypes.string,

}

const TagListContainer = React.createClass({
  render() {
    return (
      <TagList name="hehe" />
    )
  },
})

export default TagListContainer
