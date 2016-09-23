import Reflux from 'reflux'
import MaAlbumAction from './MaAlbumAction'
import _ from 'lodash'

const MaAlbumStore = Reflux.createStore({
  getInitialState: function() {
    return this.data
  },
  // 只要store被import到，就会执行init，即使import它的地方并没有加载到router里
  // 所以就不能在init里发Action了
  // 但是为了完成数据的按需加载，这一步可以放在getInitialState里
  init: function() {
    this.listenTo(MaAlbumAction.add.success, this.add)
    /* 初始化数据 */
    this.data = []
  },
  add: function(serverData) {
    const self = this
    self.data = _.cloneDeep(serverData.data)
    self.trigger(_.cloneDeep(self.data))
  },
})

export default MaAlbumStore
