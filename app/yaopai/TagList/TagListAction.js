import Reflux from 'reflux'

<<<<<<< HEAD:app/yaopai/TagList/TagListAction.js
import { postStar } from 'util/HttpFactory'
import { API_URL } from 'util/api'
=======
import { postStar } from 'app/scripts/HttpFactory'
import { API_URL } from 'app/scripts/api'
>>>>>>> dev:app/yaopai/TagList/TagListAction.js

const getTagConfig = (type) => {
  const tagConfig = {
    mote: {
      url: `${API_URL}MoteAlbumsTag.List`,
      key: `mote`,
    },
    ma: {
      url: `${API_URL}MakeupArtistAlbumsTag.List`,
      key: `ma`,
    },
  }

  return tagConfig[type]
}


const TagListAction = Reflux.createActions({
  get: { children: ['success', 'failure'] },
})

TagListAction.get.listen(function(type) {
  const self = this
  const tagConfig = getTagConfig(type)
  if (tagConfig) {
    const { url, key } = tagConfig
    postStar(url, {
      fields: 'Id,Name,Pinyin',
      /* 以下表示不分页 */
      pageSize: 0, pageIndex: 0,
    }, (data) => {
      self.success(type, data.Result.map(record => ({
        id: record.Id,
        name: record.Name,
        phonics: record.Pinyin,
      })))
    }, self.failure)
  } else {
    console.error(`Unexpected tag type: [${type}]. Please check your param for [TagListAction.get].`)
  }
})

export default TagListAction
