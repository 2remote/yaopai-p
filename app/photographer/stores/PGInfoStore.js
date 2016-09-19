import Reflux from 'reflux'
import _ from 'lodash'
import PGInfoAction from 'photographer/actions/PGInfoAction'

/**
 * PGInfoStore
**/
const PGInfoStore = Reflux.createStore({
  init() {
    this.listenTo(PGInfoAction.fetch.success, this.add)
  },

  add(data) {
    console.log('got data from PGInfoAction', data)
  },
})

export default PGInfoStore
