import Reflux from 'reflux'

import TagListAction from './TagListAction'

const TagListStore = Reflux.createStore({
  getInitialState: function() {
    return this.data;
  },
  init: function() {
    this.data = {};
    this.listenTo(TagListStore.get.success,this.onGetTagList)
  },
  onGetTagList: function(type, list) {
    this.data[type] = list
  },
})

export default TagListStore
