import Reflux from 'reflux'

const MoteStore = Reflux.createStore({
  getInitialState: function() {
    return this.data
  },
  getInitialState: function() {
    this.data = {
      studio: '',
    }
  },
})

export default MoteStore
