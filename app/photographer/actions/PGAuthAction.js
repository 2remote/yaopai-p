import Reflux from 'reflux'

import request from 'util/request'
import { apiServer } from 'util/config'
import { error } from 'util/logger'

import { unloadPGInfo } from 'photographer/functions'

const API = {
  apply: `${apiServer}Photographer.SubmitAudit`,
  view: `${apiServer}Photographer.ViewAudit`,
}

const PGAuthAction = Reflux.createActions({
  apply: { children: ['success', 'failure'] }, // 申请审核
  view: { children: ['success', 'failure'] }, // 获取审核资料
})


PGAuthAction.apply.listen(function (id, current = false) {
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
