import Reflux from 'reflux'
import _ from 'lodash'

import TagListAction from './TagListAction'

const TagListStore = Reflux.createStore({
  getInitialState: function() {
    return this.data;
  },
  init: function() {
    this.data = {};
    this.listenTo(TagListAction.get.success,this.onGetTagList)
  },
  onGetTagList: function(type, list) {
    this.data[type] = list
    this.trigger(_.cloneDeep(this.data))
  },
})

export default TagListStore
