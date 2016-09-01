var Reflux = require('reflux');
var { postStar } = require('../HttpFactory');
var API = require('../api');

/* Util functions */
const convertAlbum = function(item) {
  // 作品数据：
  // Id: [Integer]
  // Title: [String] //标题
  // UserId: [Integer] //所属用户Id
  // CreationTime: "0001-01-01T00:00:00" //添加时间
  // EditingTime: "0001-01-01T00:00:00" //最后编辑时间
  // Display: [Boolean] //是否显示(由摄影师设置是否上架)
  // Description: [String] //作品描述
  // Service: [String] //作品服务
  // Price: [Number] //价格
  // Cover: "http://xxx.jpg" //封面Url，可使用七牛view2模式
  // Cut:"{
  //    \"w\":\"Web 作品列表封面坐标字符串\",    //如 ?imageMogr2/crop/!1727x966a73a110/thumbnail/!600x336r
  //    \"wo\":\"Web 订单封面坐标字符串\",
  //    \"i\":\"iOS 作品列表封面坐标字符串\",
  //    \"io\":\"iOS 订单封面坐标字符串\"
  // }", //封面裁剪函数, Json 的字符串格式
  // Views: [Integer], //访问量
  // Marks: [Integer], //关注量
  // MarkExist: [Boolean] //当前登陆用户是否已关注
  // State: [Integer] //0=未审核，1=审核通过，2=审核失败
  // FoulReason: [String] //审核失败原因
  // Detail: { //套系详情
  //   "Duration": [String] //拍摄时长
  //   "PlateCount": [Integer] //底片张数
  //   "TruingCount": [Integer] //精修张数
  //   "CostumeCount": [Integer] //服装数目
  //   "MakeUpSupport": [Boolean] //化妆造型
  //   "OriginalSupport": [Boolean] //送原片
  //   "PhysicalSupport": [Boolean] //提供实体产品
  //   "PhysicalDetail": [String] //实体产品提供详情
  //   "UnitCount": [Integer] //拍摄几组
  //   "SceneCount": [Integer] //拍摄场景数量
  //   "PeopleCount": [Integer] //被拍摄人数
  //   "SeatCount": [Integer] //拍摄机位
  //   "PlaceType": [Integer] //拍摄场地 ,详见备注
  // },
  // Tags: [ //标签集合
  //   {
  //     Id: [Integer] //标签Id
  //     Name: [String] //标签名称
  //   }
  // ],
  // Photos: [ //照片数组
  //   {
  //     Id: [Integer] //照片id
  //     AlbumsId: [Integer] //所属作品
  //     Url: "xxx.jpg" //照片Url，可使用七牛view2模式
  //     Description: [String] //照片说明
  //     IsPending: [Boolean] //是否审核(该属性对前台无意义)
  //   }
  // ]
  return {
    id: item.Id,
    title: item.Title,
    createTime: item.CreationTime,
    editTime: item.EditingTime,
    display: item.Display,
    desc: item.Description,
    service: item.Service,
    price: item.Price,
    cover: item.Cover,
    state: item.State,
  };
};

var AlbumAction = Reflux.createActions({
  'fetch': { children: ['success', 'error']},
  'onSale': { children: ['success', 'error'] },
  'offSale': { children: ['success', 'error'] },
  'sort': { children: ['success', 'error'] },
  'delete' : {children: ['success', 'error']},
  'add' : {children: ['success', 'error']},
});

AlbumAction.fetch.listen(function(photographerId) {
  const self = this;
  postStar(API.ALBUMS.search, {
    Fields: 'Id,Title,UserId,CreationTime,EditingTime,Display,' +
      'Description,Service,Price,Cover,Views,Marks,State,FoulReason,' +
      'Detail.Duration,Detail.PlateCount,Detail.TruingCount,Detail.CostumeCount,' +
      'Detail.MakeupSupport,Detail.OriginalSupport,Detail.PhysicalSupport,' +
      'Detail.PhysicalDetail,Detail.UnitCount,Detail.SceneCount,Detail.PeopleCount,' +
      'Detail.SeatCount,Detail.PlaceType' +
      ',Tags.Id,Tags.Name,' +
      ',Photos.Id,Photos.AlbumsId,Photos.Url,Photos.Description',
    UserId: photographerId,
  }, function(serverData) {
    if(serverData.Result && serverData.Result.length) {
      let albumList = [];
      // 后台数据解析
      for(let result in serverData.Result) {
        albumList.push(convertAlbum(serverData.Result[result]));
      }
      self.success(albumList);
    }
  }, function(error) {
    console.log('[Error][Albums.Search]', error);
  });
});

/**
 * 给作品上架
**/
AlbumAction.onSale.listen(function(albumId) {

});

/**
 * 给作品下架
**/
AlbumAction.offSale.listen(function(albumId) {

});

/**
 * 给作品排序 - 传入完整作品排序后的结果
**/
AlbumAction.sort.listen(function(ids) {
  let self = this;
  postStar(API.ALBUMS.sorting, {
    Ids: ids,
  }, function(serverData) {
    self.success(ids);
  }, function(error) {
    self.error(error);
  });
});

/**
 * 删除作品
 **/
AlbumAction.delete.listen(function(albumId) {
  let self = this;
  postStar(API.ALBUMS.delete, {
      id: albumId,
  }, function(data) {
    self.success(albumId);
  }, function(error) {
    self.error(error);
  });
});

/**
 * 添加作品
 **/
AlbumAction.add.listen(function(data) {
  let self = this;
  var item = {"data":data,"res":''};
  postStar(API.ALBUMS.add, data, function(res) {
    item.res = res;
    if(res.Success){
      //将上传的内容传递给store
      self.success(item);
    }
  }, function(error) {
    self.error(error);
  });
});

module.exports = AlbumAction;
