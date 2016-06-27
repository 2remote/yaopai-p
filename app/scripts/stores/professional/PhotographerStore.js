import Reflux from 'reflux'

const PhotographerStore = Reflux.createStore({
  getInitialState: function() {
    return this.data
  },
  getInitialState: function() {
    this.data = {
      studio: '',
    }
  },
})

export default PhotographerStore
