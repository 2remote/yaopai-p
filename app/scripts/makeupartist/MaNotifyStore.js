import Reflux from 'reflux'
import MaAlbumAction from './MaAlbumAction'

const MA_UPLOAD_ALBUM = 'makeup_artist_upload_album'

const MaNotifyStore = Reflux.createStore({
  init: function() {
    this.listenTo(MaAlbumAction.add.success, this.triggerWrapper(MA_UPLOAD_ALBUM, true));
    this.listenTo(MaAlbumAction.add.failure, this.triggerWrapper(MA_UPLOAD_ALBUM, false));
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

export default MaNotifyStore
export {
  MA_UPLOAD_ALBUM,
  MaNotifyStore,
}
