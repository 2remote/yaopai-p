import _ from 'lodash'
import { error } from 'util/logger'

const unloadPGAlbums = (serverAlbums = []) => {
  const result = []
  if (!_.isArray(serverAlbums)) {
    error('unloadPGAlbums expected an array of data but found', serverAlbums)
    return result
  }

  return serverAlbums.map((serverAlbum) => {
    const album = {}
    if (!serverAlbum) {
      error('unloadPGAlbums is not expecting a empty album object in the list!', serverAlbum)
      return album
    }
    /* 基本信息 */
    if (serverAlbum.Id) album.id = serverAlbum.Id
    if (serverAlbum.UserId) album.userId = serverAlbum.UserId
    if (serverAlbum.Title) album.title = serverAlbum.Title
    if (serverAlbum.Description) album.description = serverAlbum.Description
    if (serverAlbum.Service) album.service = serverAlbum.Service
    if (serverAlbum.Price) album.price = serverAlbum.Price
    if (serverAlbum.Cover) album.cover = serverAlbum.Cover
    if (serverAlbum.Display) album.display = serverAlbum.Display
    if (_.isFinite(serverAlbum.State)) album.state = serverAlbum.State
    /* 照片信息 */
    if (!_.isArray(serverAlbum.Photos)) {
      album.photos = []
    } else {
      album.photos = serverAlbum.Photos.map(serverPhoto => {
        const photo = {}
        if (!serverPhoto) {
          return photo
        }

        if (serverPhoto.Id) photo.id = serverPhoto.Id
        if (serverPhoto.AlbumsId) photo.parentId = serverPhoto.AlbumsId
        if (serverPhoto.Url) photo.url = serverPhoto.Url
        if (serverPhoto.Description) photo.description = serverPhoto.Description

        return photo
      })
    }
    /* 标签信息 */
    if (!_.isArray(serverAlbum.Tags)) {
      album.tags = []
    } else {
      album.tags = serverAlbum.Tags.map(serverTag => {
        const tag = {}
        if (!serverTag) {
          return tag
        }

        if (serverTag.Id) tag.id = serverTag.Id
        if (serverTag.Name) tag.name = serverTag.Name

        return tag
      })
    }
    /* 详情信息 */
    album.detail = {}
    if (serverAlbum.Detail) {
      const serverDetail = serverAlbum.Detail
      if (serverDetail.Duration) album.detail.duration = serverDetail.Duration
      if (serverDetail.PlateCount) album.detail.films = serverDetail.PlateCount
    }

    return album
  })
}

export default unloadPGAlbums
/**
 * 作品数据结构
 * - - - - - - - - 基本信息 - - - - - - - -
 * - Id -> id: [integer]
 * - Title -> title: [string] 标题
 * - UserId -> userId: [integer] 所属用户Id
 * - Display -> display: [bool] 是否显示(由摄影师设置是否上架)
 * - Description -> description: [string] 作品描述
 * - Service -> service: [string] 作品服务描述
 * - Price -> price: [number] 价格
 * - Cover -> cover: [string url] 封面Url
 * - - - - - - - - 照片信息 - - - - - - - -
 * - Photos -> photos: [array] 照片数组
 *   - Id -> id: [integer] 照片id
 *   - AlbumsId -> parentId: [integer] 所属作品
 *   - Url -> url: [string url] 照片Url
 *   - Description -> description: [string] 照片说明
 * - - - - - - - - 套系信息 - - - - - - - -
 * - Detail -> detail: [object/map] 套系详情
 *   - Duration -> duration: [string] 拍摄时长（文字描述）
 *   - PlateCount -> films: [integer] 底片张数
 *   - TruingCount -> : [integer] 精修张数
 *   - CostumeCount -> : [integer] 服装数目
 *   - MakeUpSupport -> : [bool] 化妆造型
 *   - OriginalSupport -> : [bool] 送原片
 *   - PhysicalSupport -> : [bool] 提供实体产品
 *   - PhysicalDetail -> : [string] 实体产品提供详情
 *   - UnitCount -> : [integer] 拍摄几组
 *   - SceneCount -> : [integer] 拍摄场景数量
 *   - PeopleCount -> : [integer] 被拍摄人数
 *   - SeatCount -> : [integer] 拍摄机位
 *   - PlaceType -> : [integer] 拍摄场地 ,详见备注
 * - - - - - - - - 标签信息 - - - - - - - -
 * - Tags -> tags: [array] 标签集合
 *   - Id -> id: [integer] 标签Id
 *   - Name -> name: [string] 标签名称
 * - - - - - - - - 审核信息 - - - - - - - -
 *   - State -> state: [integer] 审核状态 - 未审核: 0 审核通过: 1 审核失败: 2
 *   - FoulReason -> reason: [string] 审核失败原因
 * - - - - - - - - 统计信息 - - - - - - - -
 * - CreationTime -> creationTime: [string] [2015-10-07T17:10:40.42] 添加时间
 * - EditingTime -> editingTime: [string] [2015-10-07T17:10:40.42] 最后编辑时间
 * -  Views -> views: [integer] 访问量
 * -  Marks -> marks: [integer] 关注量
 * -  MarkExist -> marked: [bool] 当前登陆用户是否已关注
 * - - - - - - - - 封面裁剪信息 - - - - - - - -
 * -  Cut:"{
 * -     \"w\":\"Web 作品列表封面坐标字符串\",
 * -     \"wo\":\"Web 订单封面坐标字符串\",
 * -     \"i\":\"iOS 作品列表封面坐标字符串\",
 * -     \"io\":\"iOS 订单封面坐标字符串\"
 * -  }",- 封面裁剪函数, Json 的字符串格式
**/
