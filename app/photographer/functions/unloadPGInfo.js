import { error } from 'util/logger'

const unloadPGInfo = (serverData) => {
  const result = {}
  if (!serverData) {
    error('there should be data to unload in unloadPGInfo')
    return result // 数据无效，返回空的“map”
  }
  /* 基本信息 */
  if (serverData.Id) result.id = serverData.Id
  if (serverData.NickName) result.nickname = serverData.NickName
  if (serverData.Sex) result.gender = serverData.Sex
  if (serverData.Avatar) result.avatar = serverData.Avatar
  if (serverData.Signature) result.signature = serverData.Signature
  if (serverData.BgImage) result.backgroundPicture = serverData.BgImage
  /* 地区信息 TODO: 改用本地数据 */
  if (serverData.CountryId) result.country = serverData.CountryId
  if (serverData.CountryName) result.countryName = serverData.CountryName
  if (serverData.ProvinceId) result.province = serverData.ProvinceId
  if (serverData.ProvinceName) result.provinceName = serverData.ProvinceName
  if (serverData.CityId) result.city = serverData.CityId
  if (serverData.CityName) result.cityId = serverData.CityName
  if (serverData.CountyId) result.county = serverData.CountyId
  if (serverData.CountyName) result.countyName = serverData.CountyName
  /* 专业信息 */
  if (serverData.OwnedStudio) { // studio info
    result.hasStudio = true
    result.studio = {
      name: serverData.StudioName || '',
      address: serverData.StudioAddress || '',
    }
  }
  result.contracted = !!serverData.Contracted
  result.disabled = !!serverData.Disabled
  /* 统计信息 */
  if (serverData.Views) result.views = serverData.Views
  if (serverData.Marks) result.followerCount = serverData.Marks
  if (serverData.Sales) result.sales = serverData.Sales
  if (serverData.TotalAlbums) result.albumCount = serverData.TotalAlbums
  /* 其他信息 */
  result.hasMarked = !!serverData.MarkExist
  if (serverData.JoiningTime) result.joinTime = serverData.JoiningTime

  return result
}

export default unloadPGInfo
/**
 * 服务器端摄影师基础结构：
 *  - - - - - - - - 基本信息 - - - - - - - -
 *  - Id -> id: [integer] Id
 *  - NickName -> nickname: [string] 昵称
 *  - Sex -> gender: [integer] 性别 - 男: 1 女: 0
 *  - Avatar -> avatar: [string url] 头像地址 可使用七牛-view2模式
 *  - Signature -> signature: [string] 个性签名
 *  - BgImage -> backgroundPicture: [string url] 个性背景地址
 *  - - - - - - - - 地区信息 - - - - - - - -
 *  - CountryId: [integer] 国家Id
 *  - CountryName: [string] 国家名称
 *  - ProvinceId: [integer] 省
 *  - ProvinceName: [string] 省名称
 *  - CityId: [integer] 市
 *  - CityName: [string] 市名称
 *  - CountyId: [integer] 县
 *  - CountyName: [string] 县名称
 *  - - - - - - - - 专业信息 - - - - - - - -
 *  - OwnedStudio: [bool] 是否拥有工作室
 *  - StudioName: [string] 工作室名称
 *  - StudioAddress: [string] 工作室地址
 *  - Contracted: [bool] 是否签约摄影师
 *  - Disabled: [bool] 用户是否禁用
 *  - - - - - - - - 统计信息 - - - - - - - -
 *  - Views: [integer] 访问量
 *  - Marks: [integer] 关注量
 *  - Sales: [integer] 总销量
 *  - TotalAlbums: [integer] 作品总数
 *  - - - - - - - - 其他信息 - - - - - - - -
 *  - MarkExist: [bool] 当前登录用户是否已关注
 *  - JoiningTime: [string] [2015-10-07T17:10:40.42] 加入时间
**/
