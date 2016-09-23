import Reflux from 'reflux'

import { postStar } from 'util/HttpFactory'
import { API_URL } from 'util/api'
import { error } from 'util/logger'

const getTagConfig = (type) => {
  const tagConfig = {
    mote: {
      url: `${API_URL}MoteAlbumsTag.List`,
      key: 'mote',
    },
    ma: {
      url: `${API_URL}MakeupArtistAlbumsTag.List`,
      key: 'ma',
    },
    pg: {
      url: `${API_URL}Tag.List`,
      key: 'pg',
    },
  }

  return tagConfig[type]
}


const TagListAction = Reflux.createActions({
  get: { children: ['success', 'failure'] },
})

TagListAction.get.listen((type) => {
  const { success, failure } = TagListAction.get
  const tagConfig = getTagConfig(type)
  if (tagConfig) {
    const { url /* , key */ } = tagConfig
    postStar(url, {
      fields: 'Id,Name,Pinyin',
      /* 以下表示不分页 */
      pageSize: 0,
      pageIndex: 0,
    }, (data) => {
      success(type, data.Result.map(record => ({
        id: record.Id,
        name: record.Name,
        phonics: record.Pinyin,
      })))
    }, failure)
  } else {
    error(`Unexpected tag type: [${type}]. Please check your param for [TagListAction.get].`)
  }
})

export default TagListAction
