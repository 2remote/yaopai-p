import React from 'react'
import Reflux from 'reflux'
import { History } from 'react-router'

var ImageInput = require('../account/imageInput');
var TextInput = require('../account/textInput');
var AreaSelect = require('../account/areaSelect');
var AccountActions = require('../../actions/AccountActions');
var InfoHeader = require('../infoHeader');

var { NotifyStore, UPDATE_INFO } = require('../../stores/NotifyStore');

import { ROUTE_AUTH_REALNAME } from '../../routeConfig'

const AuthBasic = React.createClass({
  mixins: [
    Reflux.listenTo(NotifyStore, 'onNotify'),
    History
  ],
  onNotify: function(result) {
    if(result.source === UPDATE_INFO) {
      if(result.success) {
        this.props.history.pushState(null, ROUTE_AUTH_REALNAME)
      } else {
        // TODO: notify logic
        this.props.showMessage(result.msg)
      }
    }
  },
  componentWillMount: function() {
    // if(this.props.userComplete) {
    //   this.props.history.replaceState(null, '/account/auth/real')
    // }
  },
  getInitialState: function() {
    return {
      ui: {
        nickname: this.props.userAccount.basic.nickname,
        province: this.props.userAccount.basic.province,
        city: this.props.userAccount.basic.city,
        county: this.props.userAccount.basic.county,
      },
    }
  },
  updateNickName: function(peter) {
    this.setState({
     ui: Object.assign({}, this.state.ui, {
       nickname: peter,
     }),
    })
  },
  onProvinceChange: function(henan) {
    this.setState({
      ui: Object.assign({}, this.state.ui, {
        province: henan,
      }),
    })
  },
  onCityChange: function(zhengzhou) {
    this.setState({
      ui: Object.assign({}, this.state.ui, {
        city: zhengzhou,
      }),
    })
  },
  onCountyChange: function(jinshui) {
    this.setState({
      ui: Object.assign({}, this.state.ui, {
        county: jinshui,
      }),
    })
  },
  /**
   * 上传头像的调用方法
   *
   * @param avatarUrl: 上传成功后七牛返回的头像url
   */
  onUpload: function(avatarUrl) {
    AccountActions.changeAvatar({Avatar : avatarUrl})
  },
  render: function() {
    var image = this.props.userAccount.basic.avatar || 'img/default_user_img.png'
    var style = {
      label: {
        lineHeight: '150px',
        verticalAlign: 'top',
      },
    }
    return (
      <div>
        <InfoHeader
          infoTitle="基本信息录入"
          infoIconClass="glyphicon glyphicon-camera"
        />
        <form className="form-horizontal" onSubmit={ this.onSubmitBasic }>
          <div className="form-group">
            <label className="control-label col-xs-3" style={style.label}>头像：</label>
            <div id="uploadAvatorC" className="col-xs-4">
              <ImageInput
                width="150"
                height="150"
                uid="uploadAvator"
                type="user"
                multi_selection={false}
                defaultImage={image}
                onUpload={this.onUpload}
                onError={this.props.showMessage}
                disabled = {false}
                circle="1"/>
            </div>
          </div>
          <TextInput ref="nickName"
            labelName="昵称："
            value={ this.state.ui.nickname }
            updateValue={ this.updateNickName }
            textClassName='col-xs-3'
            isRequired={ true }
            minLength={ 1 }
            maxLength={ 10 }
            disabled={ false }
          />
          <AreaSelect ref="area"
            province={ this.state.ui.province }
            onProvinceChange={ this.onProvinceChange }
            city={ this.state.ui.city }
            onCityChange={ this.onCityChange }
            district={ this.state.ui.county }
            onDistrictChange={ this.onCountyChange }
            disabled={ false }
          />
          <div className="form-group">
            <div className="col-xs-offset-3 col-xs-9">
              <button type="submit" className="btn btn-default">下一步</button>
            </div>
          </div>
        </form>
      </div>
    )
  },
  onSubmitBasic: function(e) {
    e.preventDefault()
    if(!this.props.userAccount.basic.avatar) {
      this.props.showMessage('请先上传您的头像！')
      return
    }
    var peter = this.state.ui.nickname
    var gender = this.props.userAccount.basic.gender
    var henan = this.state.ui.province
    var zhengzhou = this.state.ui.city
    var jinshui = this.state.ui.county
    if(!peter) {
      this.props.showMessage('请填写昵称！')
      return
    }
    if(!zhengzhou && !jinshui) {
      this.props.showMessage('请选择常驻地！')
      return
    }
    // TODO: 好了，现在做校验吧！
    AccountActions.updateInfo({
      NickName: peter,
      Sex: gender,
      Location: jinshui || zhengzhou || henan, // 地区 > 城市 > 省份
      ProvinceId: henan,
      CityId: zhengzhou,
      CountyId: jinshui,
    })
  },
})

export default AuthBasic
