var Reflux = require('reflux');
var AlbumsActions = require('../actions/AlbumsActions');
var AlbumAction = require('../actions/AlbumAction');

const ALBUM_NOT_FETCHED = 0;
const ALBUM_FETCHED = 1;

/**
 * 关于作品排序：
 * 后台对作品的上下架和排序是无相关控制的，这里从前端做简单的管理：
 * 1. 上架作品排在下架作品之前
 * 2. 下架作品上架时排在所有上架作品最后
 * 3. 上架作品下架时排在所有下架作品最前
 * 4. 对于并没有按照先排上架作品后排下架作品的老数据，
 *    前端接收数据后自动调整顺序（但不发后台），待遇到排序请求时再发送
**/
const AlbumStore = Reflux.createStore({
  getInitialState: function() {
    return this.data;
  },
  init: function() {
    // Initial data for Album info
    this.listenTo(AlbumAction.fetch.success, this.updateList);
    this.data = {
      status: ALBUM_NOT_FETCHED,
      onSaleList: [],
      offSaleList: [],
    };
  },
  updateList: function(list) {
    var onSaleList = [];
    var offSaleList = [];
    for(albumIndex in list) {
      let album = list[albumIndex];
      if(album.display) {
        onSaleList.push(album);
      } else {
        offSaleList.push(album);
      }
    }
    this.data = {
      status: ALBUM_FETCHED,
      onSaleList,
      offSaleList,
    };
    this.trigger(this.data);
  },
});

module.exports = {
  ALBUM_NOT_FETCHED,
  ALBUM_FETCHED,
  AlbumStore,
};
