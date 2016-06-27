import Reflux from 'reflux'
import { postStar } from '../../HttpFactory'
import { MOTE } from '../../api'

const MODEL_TYPE_MASK_STILL = '1'
const MODEL_TYPE_MASK_ETIQUETTE = '2'

function styleMaskConverter(binaryType, mask) {
  return !!(binaryType & mask) // double bang produces boolean
}

function convertMoteData(serverData) {
  let convertedData = {
    styleCode: serverData.Style, // 风格
    style: {
      isStill: styleMaskConverter(serverData.Style, MODEL_TYPE_MASK_STILL), // 是否平面模特
      isEtiquette: styleMaskConverter(serverData.Style, MODEL_TYPE_MASK_ETIQUETTE), // 是否礼仪模特
    },
    /*  身高、体重 */
    height: serverData.Height,
    weight: serverData.Weight,
    /* bwh 三围 */
    bust: serverData.Chest,
    waist: serverData.Waist,
    hip: serverData.Hips,
    /* 鞋码 发色 瞳色 */
    shoeSize: serverData.ShoeSize,
    hairColor: serverData.HairColor,
    pupil: serverData.Pupil,
  }
  return convertedData
}

/**
 * 模特
**/
const MoteAction = Reflux.createActions({
  currentInfo: { children: ['success', 'error'] }, // 获取当前模特信息
  changeInfo: { children: ['success', 'error'] }, // 修改模特信息
  get: { children: ['success', 'error'] }, // 获取模特信息（非当前用户）
  search: { children: ['success', 'error'] }, // 获取模特列表
  addView: { children: ['success', 'error'] }, // 添加view
  mark: { children: ['success', 'error'] }, // 加关注
  unmark: { children: ['success', 'error'] }, // 取消关注
})

MoteAction.currentInfo.listen(function() {
  let self = this
  postStar(MOTE.currentInfo, {
    // TODO: 后台接口的数据还不全，等确定了记得改这里
    Fields: 'Style,Height,Chest,Waist,Hips',
  }, function(resp) {
    self.success(convertMoteData(resp))
  }, self.error)
})

MoteAction.changeInfo.listen(function(info) {
  let self = this
  postStar(MOTE.changeInfo, {
    Style: '',
  }, function(resp) {
    let data = {

    }
  }, self.error)
})
