import Reflux from 'reflux'
import { postStar } from '../../HttpFactory'
import { MOTE } from '../../api'

const MODEL_TYPE_MASK_STILL = '1'
const MODEL_TYPE_MASK_ETIQUETTE = '2'

// TODO: 先把颜色的事放这里
// TODO: 瞳色和发色都是颜色，用一致的Enum吧？
const COLOR = {
  None: { code: 'None', text: '无' },
  Black: { code: 'Black', text: '黑色' },
  Brown: { code: 'Brown', text: '棕色' },
  Blue: { code: 'Blue', text: '蓝色' },
  Gray: { code: 'Gray', text: '灰色' },
  Green: { code: 'Green', text: '绿色' },
  Blond: { code: 'Blond', text: '金黄色' },
  Red: { code: 'Red', text: '红色' },
  White: { code: 'White', text: '白色' },
}

function styleMaskConverter(binaryType, mask) {
  return !!(binaryType & mask) // double bang produces boolean
}

function convertMoteData(serverData) {
  console.log('[serverData]', serverData)
  let convertedData = {
    // styleCode: serverData.Style, // 风格
    // style: {
    //   isStill: styleMaskConverter(serverData.Style, MODEL_TYPE_MASK_STILL), // 是否平面模特
    //   isEtiquette: styleMaskConverter(serverData.Style, MODEL_TYPE_MASK_ETIQUETTE), // 是否礼仪模特
    // },
    /*  身高(cm)、体重(kg) */
    height: serverData.Height,
    weight: serverData.Weight,
    /* bwh 三围(cm) */
    bust: serverData.Bust,  // 从Chest调整到Bust，看来他百度到了！
    waist: serverData.Waist,
    hip: serverData.Hips,
    /* 鞋码(int) 发色 瞳色 */
    shoeSize: serverData.Shoes,
    hairColor: COLOR[serverData.Hair] || COLOR.None,
    pupil: COLOR[serverData.Eyes] || COLOR.None,
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
    Fields: 'Height,Weight,Bust,Waist,Hips,Shoes,Eyes,Hair',
  }, function(resp) {
    self.success(convertMoteData(resp))
  }, self.error)
})

MoteAction.changeInfo.listen(function(info) {
  let self = this
  const postData = {
    Height: info.height, // 身高 cm
    Weight: info.weight, // 体重 kg
    Bust: info.bust, // 胸围 cm
    Waist: info.waist, // 腰围 cm
    Hips:	info.hip, // 臀围 cm
    Eyes: info.pupil, // 眼睛
    Hair: info.hairColor, // 发色
    Shoes: info.shoeSize, // 鞋码
  }
  postStar(MOTE.changeInfo, postData, function(resp) {
    self.success(convertMoteData(postData))
  }, self.error)
})

export default MoteAction
