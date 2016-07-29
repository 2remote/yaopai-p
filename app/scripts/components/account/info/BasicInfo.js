/**
 * https://xiattst.gitbooks.io/yaopai/content/API/User/ChangeInfo.html
 * NickName	string	Y	昵称请控制在 1-10个字符，不要包含“%＆amp;*＃￥”等特殊字符	昵称
 * Sex	integer	Y	--	性别 1男0女 , 默认为0
 * Location	integer	Y	--	地区Id，可以是省、市或区的Id，为0时将清空地区
 * Signature	string	N	个性签名请控制在 0-100个字符	个性签名
**/
import React from 'react'
import Reflux from 'reflux'

import InputGroup from '../../upai/form/InputGroup'
import SelectArea from '../../upai/form/SelectArea'
import ImageCropper from '../../upai/ImageCropper'
import ImageOptimus from '../../upai/ImageOptimus'


import UserAccountStore from '../../../stores/UserAccountStore'

const BasicInfo = React.createClass({
  mixins: [Reflux.connect(UserAccountStore, 'userInfo')],
  getInitialState() {
    return { }
  },
  updateUI(key, value) {
    this.setState({
      [key]: value,
    })
  },
  render() {
    const { uiNickname } = this.state
    return (
      <div>
        <h4>BasicInfo</h4>
        <form className="form-horizontal">
          <InputGroup label="昵称" type="text" inputId="info-nickname"
            horizontalLabelStyle="col-sm-3"
            horizontalInputStyle="col-sm-9"
            value={ uiNickname }
            updateValue={ val => updateUI('uiNickname', val) }
          />
          <SelectArea />
          <hr />
          <ImageCropper />
          <hr />
          <ImageOptimus />
        </form>
      </div>
    )
  },
})

export default BasicInfo
