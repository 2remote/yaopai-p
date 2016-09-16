import Reflux from 'reflux'

import request from 'util/request'
import { apiServer } from 'util/config'
import { error } from 'util/logger'

import { unloadPGInfo } from 'photographer/functions'

const API = {
  current: `${apiServer}Photographer.CurrentPhotographer`,
  change: `${apiServer}Photographer.ChangePhotographer`,
  get: `${apiServer}Photographer.Get`,
  search: `${apiServer}Photographer.Search`,
  view: `${apiServer}Photographer.ViewAdd`,
  mark: `${apiServer}Photographer.Mark`,
  unmark: `${apiServer}Photographer.UnMark`,
  searchMarker: `${apiServer}PhotographerUserMarked.Search`,
}

const PGInfoAction = Reflux.createActions({
  fetch: { children: ['success', 'failure'] }, // 获取
  update: { children: ['success', 'failure'] }, // 更改
  search: { children: ['success', 'failure'] }, // 查找
  view: { children: ['success', 'failure'] }, // 浏览
  follow: { children: ['success', 'failure'] }, // 关注
  unfollow: { children: ['success', 'failure'] }, // 取消关注
  searchFollowers: { children: ['success', 'failure'] }, // 查找关注者
})


PGInfoAction.fetch.listen((id, current = false) => {
  const { success, failure } = PGInfoAction.fetch
  if (!id && !current) {
    error('PGInfoAction cannot fetch data that does not have an id nor current')
  }

  const url = current ? API.current : API.get
  let data = {}

  if (current) {
    data = {
      fields: 'Id,NickName,Sex,Avatar,Signature,BgImage,'
        + 'OwnedStudio,StudioName,StudioAddress,Contracted,Disabled,'
        + 'Views,Marks,Sales,TotalAlbums,'
        + 'MarkExist,JoiningTime',
    }
  } else {
    data = {
      id,
      fields: 'Id,NickName,Sex,Avatar,Signature,BgImage,'
        + 'OwnedStudio,StudioName,StudioAddress,Contracted,Disabled,'
        + 'Views,Marks,Sales,TotalAlbums,'
        + 'MarkExist,JoiningTime',
    }
  }

  request(url, data, (resp) => {
    success(unloadPGInfo(resp))
  }, failure)
})

export default PGInfoAction

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
