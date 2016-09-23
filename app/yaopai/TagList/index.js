import React, { PropTypes } from 'react'
import Reflux from 'reflux'
import _ from 'lodash'

import TagListAction from './TagListAction'
import TagListStore from './TagListStore'

/* eslint-disable react/prefer-es6-class, react/prefer-stateless-function */
const TagList = React.createClass({
  propTypes: {
    size: PropTypes.string,
    gutter: PropTypes.number,
    maxCount: PropTypes.number,
    list: PropTypes.arrayOf({
      id: PropTypes.number,
      name: PropTypes.string,
      phonics: PropTypes.string,
    }),
  },

  render() {
    const { size, gutter, list, maxCount, selectedTagIds, onTagSelect } = this.props

    const onClick = (e, isTagSelected, tag, max) => {
      const MAX = 1024
      // as always
      if (e && e.preventDefault) e.preventDefault()

      onTagSelect(isTagSelected ?
        _.without(selectedTagIds, tag.id) :
        _.takeRight(_.union(selectedTagIds, [tag.id]), max || MAX)
      )
    }

    window._ = _

    return (
      <div>
        {
          list.map(tag => {
            const isTagSelected = _.find(selectedTagIds, id => id === tag.id)

            return (
              <button
                className={`btn ${isTagSelected ? 'btn-primary' : 'btn-default'}`}
                style={{ marginRight: gutter, marginBottom: gutter }}
                onClick={e => onClick(e, isTagSelected, tag, maxCount)}
              >
                {_.find(selectedTagIds, tag.id)}
                {tag.name}
              </button>
            )
          })
        }
      </div>
    )
  },
})

const TagListContainer = React.createClass({
  propTypes: {
    type: PropTypes.string.isRequired,
    gutter: PropTypes.number,
    size: PropTypes.string,
    maxCount: PropTypes.number,
    selectedTagIds: PropTypes.func,
    onTagSelect: PropTypes.func,
  },

  mixins: [Reflux.connectFilter(TagListStore, 'list', function(lists) {
    return lists[this.props.type]
  })],

  componentDidMount() {
    if (!this.state.list) {
      TagListAction.get(this.props.type)
    }
  },

  render() {
    return (
      <TagList
        size={this.props.size}
        gutter={this.props.gutter}
        list={this.state.list || []}
        selectedTagIds={this.props.selectedTagIds}
        onTagSelect={this.props.onTagSelect}
        maxCount={this.props.maxCount}
      />
    )
  },
})

export default TagListContainer
