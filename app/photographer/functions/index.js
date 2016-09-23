import { error } from 'util/logger'
import _ from 'lodash'

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

const unloadPGAlbums = (serverAlbums = []) => {
  const result = []
  if (!_.isArray(serverAlbums)) {
    return result
  }

  return serverAlbums.map((serverAlbum) => serverAlbum.id)
}

export { unloadPGInfo, unloadPGAlbums }
