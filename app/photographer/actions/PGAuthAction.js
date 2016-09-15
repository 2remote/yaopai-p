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

const PGAuthAction = Reflux.createActions({
  fetch: { children: ['success', 'failure'] }, // 获取
  update: { children: ['success', 'failure'] }, // 更改
  search: { children: ['success', 'failure'] }, // 查找
  view: { children: ['success', 'failure'] }, // 浏览
  follow: { children: ['success', 'failure'] }, // 关注
  unfollow: { children: ['success', 'failure'] }, // 取消关注
  searchFollowers: { children: ['success', 'failure'] }, // 查找关注者
})


PGAuthAction.fetch.listen(function (id, current = false) {
  const { success, failure } = this
  if (!id && !current) {
    error('PGAuthAction cannot fetch data that does not have an id nor current')
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

export default PGAuthAction
