/**
 * https://xiattst.gitbooks.io/yaopai/content/API/UserChange/ChangeContactDetailRequest.html
 * ContactOicq	string	N	-	QQ
 * ContactWeibo	string	N	--	微博
 * ContactWeixin	string	N	--	微信
**/
import React from 'react'
import Reflux from 'reflux'

import InputGroup from '../../upai/form/InputGroup'

import UserAccountStore from '../../../stores/UserAccountStore'

const DetailInfo = React.createClass({
  mixins: [Reflux.connect(UserAccountStore, 'userInfo')],
  getInitialState() {
    return { }
  },
  updateUI(key, value) {
    this.setState({
      [key]: value,
    })
    let hehe = {
      [key]: value,
    }
    console.warn('alalala', hehe)
  },
  onSubmit(e) {
    e.preventDefault()
  },
  render() {
    const self = this
    const { uiQQ, uiweibo, uiwechat } = this.state
    return (
      <div>
        <h4>BasicInfo</h4>
        <form className="form-horizontal" onSubmit={ this.onSubmit }>
          <InputGroup label="QQ" type="text" inputId="info-QQ"
            horizontalLabelStyle="col-sm-3"
            horizontalInputStyle="col-sm-9"
            value={ uiQQ }
            updateValue={ val => self.updateUI('uiQQ', val) }
          />
          <InputGroup label="微博" type="text" inputId="info-weibo"
            horizontalLabelStyle="col-sm-3"
            horizontalInputStyle="col-sm-9"
            value={ uiweibo }
            updateValue={ val => self.updateUI('uiweibo', val) }
          />
          <InputGroup label="微信" type="text" inputId="info-wechat"
            horizontalLabelStyle="col-sm-3"
            horizontalInputStyle="col-sm-9"
            value={ uiwechat }
            updateValue={ val => self.updateUI('uiwechat', val) }
          />
          <button type="submit" className="btn btn-default">保存</button>
        </form>
      </div>
    )
  },
})

export default DetailInfo
