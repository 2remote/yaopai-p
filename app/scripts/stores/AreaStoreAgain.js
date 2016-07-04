import Reflux from 'reflux'

import AreaAction from '../actions/AreaAction'

/**
 * Store for area information.
 * Each area contains these information:
 * 1. Id: unique id for an area (province/city/district)
 * 2. Name: Chinese name of the area
 * 3. Pinyin: English name of the area
 * 4. ParentId: parent id
 * I DO NOT intend to store area information in one tree though it seems logically right.
**/
const AreaStore = Reflux.createStore({
  getInitialState() {
    if(this.data.pristine) {
      AreaAction.loadChildren(0) // 传入ParentId为0时获取所有省份
    }
    return this.data
  },
  init() {
    this.listenTo(AreaAction.loadChildren.success, this.updateInfo)
    this.data = {
      pristine: true,
      children: {},
    }
  },
  updateInfo({ id, children }) {
    const self = this
    self.data.children[id] = children
    for(const index in children) {
      const { id, cn, en, parentId } = children[index]
      self.data[id] = {
        id,
        cn,
        en,
        parentId,
      }
    }
    this.data.pristine = false
    self.trigger(self.data)
  },
})

export default AreaStore
