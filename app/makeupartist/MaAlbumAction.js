import Reflux from 'reflux'
<<<<<<< HEAD:app/makeupartist/MaAlbumAction.js
import { postStar } from 'util/HttpFactory'
import { API_URL } from 'util/api'
=======
import { postStar } from '../scripts/HttpFactory'
import { API_URL } from '../scripts/api'
>>>>>>> dev:app/makeupartist/MaAlbumAction.js

/* api const */
const MAKEUPARTIST_ALBUM_ADD = `${API_URL}MakeupArtistAlbums.Add`

const photoFakeToString = (photo, idx) => {
  // url is a must, desc is optional
  let { url, desc } = photo
  // composition
  let result = `photos[${idx}].Url=${url}`
  if (desc) {
    result += `&photos[${idx}].Description=${desc}`
  }
}

/**
 * 模特
**/
const MaAlbumAction = Reflux.createActions({
  add: { children: ['success', 'failure'] }, // 添加作品
})

MaAlbumAction.add.listen(function(album) {
  const self = this
  const { title, desc, cover, tags, photos } = album

  const formData = {
    title,
    description: desc,
    cover,
  }

  if (tags && tags.length) {
    formData.tags = tags.join(',')
  }

  if (photos && photos.length) {
    formData.photos = photos.map(photo => ({
      Url: photo.url,
      Description: photo.desc,
    }))
  }

  postStar(MAKEUPARTIST_ALBUM_ADD, formData, () => {
    self.success({
      Success: true,
      ErrorMsg: '',
      data: album,
    })
  }, self.failure)
})

export default MaAlbumAction
