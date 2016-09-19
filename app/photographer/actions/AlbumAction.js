import Reflux from 'reflux'
import request from 'util/request'
import { apiServer } from 'util/config'
import { log } from 'util/logger'
import {
  PG_ALBUM_ADD,
  PG_ALBUM_UPDATE,
  PG_ALBUM_DELETE,
  // PG_ALBUM_GET,
  PG_ALBUM_SEARCH,
  // PG_ALBUM_SALES_ON,
  // PG_ALBUM_SALES_OFF,
  PG_ALBUM_SALES_SORTING,
  // PG_ALBUM_SALES_VIEW_ADD,
  // PG_ALBUM_SALES_MARK,
  // PG_ALBUM_SALES_UNMARK,
} from 'photographer/constants'
import { unloadPGAlbums } from 'photographer/functions'

const API = {
  add: `${apiServer}${PG_ALBUM_ADD}`,
  update: `${apiServer}${PG_ALBUM_UPDATE}`,
  delete: `${apiServer}${PG_ALBUM_DELETE}`,
  search: `${apiServer}${PG_ALBUM_SEARCH}`,
  sort: `${apiServer}${PG_ALBUM_SALES_SORTING}`,
}

const AlbumAction = Reflux.createActions({
  fetch: { children: ['success', 'failure'] },
  onSale: { children: ['success', 'failure'] },
  offSale: { children: ['success', 'failure'] },
  sort: { children: ['success', 'failure'] },
  delete: { children: ['success', 'failure'] },
  add: { children: ['success', 'failure'] },
  update: { children: ['success', 'failure'] },
})

AlbumAction.fetch.listen((photographerId) => {
  const { success, failure } = AlbumAction.fetch

  request(API.search, {
    Fields: 'Id,Title,UserId,CreationTime,EditingTime,Display,' +
    'Description,Service,Price,Cover,Views,Marks,State,FoulReason,' +
    'Detail.Duration,Detail.PlateCount,Detail.TruingCount,Detail.CostumeCount,' +
    'Detail.MakeupSupport,Detail.OriginalSupport,Detail.PhysicalSupport,' +
    'Detail.PhysicalDetail,Detail.UnitCount,Detail.SceneCount,Detail.PeopleCount,' +
    'Detail.SeatCount,Detail.PlaceType' +
    ',Tags.Id,Tags.Name,' +
    ',Photos.Id,Photos.AlbumsId,Photos.Url,Photos.Description',
    UserId: photographerId,
  }, (serverData) => success(unloadPGAlbums(serverData.Result)), failure)
})

/**
 * 给作品上架
**/
AlbumAction.onSale.listen((albumId) => {
  log('AlbumAction.onSale is under development.', albumId)
})

/**
 * 给作品下架
**/
AlbumAction.offSale.listen((albumId) => {
  log('AlbumAction.offSale is under development.', albumId)
})

/**
 * 给作品排序 - 传入完整作品排序后的结果
**/
AlbumAction.sort.listen((ids) => {
  const { success, failure } = AlbumAction.sort
  request(API.sort, {
    Ids: ids,
  }, () => success(ids), failure)
})

/**
 * 删除作品
 **/
AlbumAction.delete.listen((albumId) => {
  const { success, failure } = AlbumAction.delete
  request(API.delete, { id: albumId }, () => success(albumId), failure)
})

/**
 * 添加作品
 **/
AlbumAction.add.listen((data) => {
  const { success, failure } = AlbumAction.add
  const item = { data, res: '' }
  request(API.add, data, (res) => {
    item.res = res
    // 将上传的内容传递给store
    success(item)
  }, failure)
})

/**
 * 更新作品
 **/
AlbumAction.update.listen((data) => {
  const { success, failure } = AlbumAction.update
  request(API.update, data, () => success(data), failure)
})

export default AlbumAction
