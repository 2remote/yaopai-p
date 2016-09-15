import Reflux from 'reflux'
import { postStar } from 'util/HttpFactory'
import { COMMON } from 'util/api'

const AreaAction = Reflux.createActions({
  'loadChildren': { children: ['success', 'error'] },
})

AreaAction.loadChildren.listen(function(parentId) {
  const self = this
  console.log(COMMON.area_list)
  postStar(COMMON.area_list, {
    ParentId: parentId || 0, // 传入ParentId为0时获取所有省份
  }, function(resp) {
    if(resp.Result.length) {
      const serverList = resp.Result
      self.success({
        id: serverList[0].ParentId,
        children: serverList.map(child => ({
          id: child.Id,
          cn: child.Name,
          en: child.Pinyin,
          parentId: child.ParentId,
        })),
      })
    }
  }, self.error)
})


export default AreaAction
