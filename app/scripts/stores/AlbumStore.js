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
    this.listenTo(AlbumAction.sort.success, this.sort);
    this.listenTo(AlbumAction.delete.success, this.delete);
    this.data = {
      status: ALBUM_NOT_FETCHED,
      onSaleList: [],
      offSaleList: [],
    };
  },
  updateList: function(list) {
    var onSaleList = [];
    var offSaleList = [];
    for(let albumIndex in list) {
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
  sort: function(ids) {
    const dataRef = this.data;
    let idList = ids.split(',');
    let albumObject = {};
    let newOnSaleList = [];
    let newOffSaleList = [];
    // 所有album放进albumObject，建立从id到Object的引用
    for(let onItem in dataRef.onSaleList) {
      let theItem = dataRef.onSaleList[onItem];
      albumObject[theItem.id] = theItem;
    }
    for(let offItem in dataRef.offSaleList) {
      let theItem = dataRef.offSaleList[offItem];
      albumObject[theItem.id] = theItem;
    }
    // 从新排序后的id列表中遍历id，使用albumObject转换成album，看display推进不同的list
    // 不过好像没有卵用的排序也会推到服务器= =
    for(let idx in idList) {
      let theItem = albumObject[idList[idx]];
      if(theItem) { // 确保作品存在，可处理异步作品被删，但没法处理异步增加作品（小概率）
        if(theItem.display) {
          newOnSaleList.push(theItem);
        } else {
          newOffSaleList.push(theItem);
        }
      }
    }
    // 重拍完成，把结果的引用传给dataRef(this.data)
    dataRef.onSaleList = newOnSaleList;
    dataRef.offSaleList = newOffSaleList;
    this.trigger(dataRef);
  },

  delete: function(albumId) {
    //移除这个元素
    var arr_on=[];
    var arr_off=[];

    for(var i in this.data.onSaleList){
      if(this.data.onSaleList[i].id == albumId){
        this.data.onSaleList.splice(i,1);
      }
    }

    for(var i in this.data.offSaleList){
      if(this.data.offSaleList[i].id == albumId){
        this.data.offSaleList.splice(i,1);
      }
    }

    this.trigger(this.data);
  }
});

module.exports = {
  ALBUM_NOT_FETCHED,
  ALBUM_FETCHED,
  AlbumStore,
};
