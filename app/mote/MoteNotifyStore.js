import Reflux from 'reflux'
import MoteAlbumAction from './MoteAlbumAction'

const MOTE_UPLOAD_ALBUM = 'mote_upload_album'

const MoteNotifyStore = Reflux.createStore({
  init: function() {
    this.listenTo(MoteAlbumAction.add.success, this.triggerWrapper(MOTE_UPLOAD_ALBUM, true));
    this.listenTo(MoteAlbumAction.add.failure, this.triggerWrapper(MOTE_UPLOAD_ALBUM, false));
  },
  triggerWrapper: function(source, success) {
    const self = this
    return function(resp) {
      self.trigger({
        source: source,
        success: success && resp.Success,
        msg: resp.ErrorMsg, // TODO: 这里要“或”一个非200的http response
      });
    };
  },
})

export default MoteNotifyStore
export {
  MOTE_UPLOAD_ALBUM,
  MoteNotifyStore,
}
