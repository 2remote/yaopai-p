import Reflux from 'reflux'
import MoteAlbumAction from './MoteAlbumAction'
import _ from 'lodash'

const MoteAlbumStore = Reflux.createStore({
  getInitialState: function() {
    return this.data
  },
  // 只要store被import到，就会执行init，即使import它的地方并没有加载到router里
  // 所以就不能在init里发Action了
  // 但是为了完成数据的按需加载，这一步可以放在getInitialState里
  init: function() {
    this.listenTo(MoteAlbumAction.add.success, this.add)
    /* 初始化数据 */
    this.data = []
  },
  add: function(serverData) {
    console.log('serverData,' serverData)
    const self = this
    // self.data = serverData.data
    // self.trigger(self.data)
    console.log('cao nabaocuole')
  },
})

export default MoteAlbumStore
