import Reflux from 'reflux'
import MoteAction from '../../actions/professional/MoteAction'

const MoteStore = Reflux.createStore({
  getInitialState: function() {
    if(this.data.pristine) {
      // maybe start fetch data from here?
      console.log('initially fetching data from server because someone invoked the connect method on Reflux for react component mixins ... ')
      MoteAction.currentInfo()
    }
    return this.data
  },
  // 只要store被import到，就会执行init，即使import它的地方并没有加载到router里
  // 所以就不能在init里发Action了
  // 但是为了完成数据的按需加载，这一步可以放在getInitialState里
  init: function() {
    /* 初始化数据 */
    this.data = {
      pristine: true, // 崭新的（未加载过信息的）
      style: '', // 风格
      /*  身高、体重 */
      height: -1, // 身高
      weight: -1, // 体重
      /* bwh 三围 */
      bust: -1, // 胸围
      waist: -1, // 腰围
      hip: -1, // 臀围
      /* 鞋码 发色 瞳色 */
      shoeSize: -1, // TODO: 范围？
      hairColor: '', // Enum?
      pupil: '', // Enum?
    }
  },
  // necessary? when action deals with data transformation
  fillData: function(serverData) {
    this.data.pristine = false
  },
})

export default MoteStore
