import React from 'react'
import Reflux from 'reflux'
import { Link } from 'react-router'
import QRCode from 'qrcode.react'

import { ROUTE_AUTH, ROUTE_ALBUM_UPLOAD, ROUTE_ACCOUNT_INFO } from '../../routeConfig'

const UserPanel = React.createClass({
  render: function() {
    let { user, logout } = this.props
    // TODO: 这个地址怎么搞？
    let userHomePage = `http://m.aiyaopai.com/#/grapherDetail/${user.basic.id}`
    return (
      <div className="panel panel-default">
        <div className="panel-body text-center">
          <div className="thumbnail" style={{ marginBottom: 100 }}>
            <img src={ user.basic.avatar } className="img-circle" />
            <div className="caption">
              <h4>{ user.basic.nickname }</h4>
              <p>{ user.basic.signature }</p>
              <button className="btn btn-default" onClick={ logout }>切换用户</button>
            </div>
          </div>
          <div style={{ marginBottom: 150 }}>
            <Link to={ ROUTE_AUTH } className="btn btn-lg btn-block btn-info">我要认证</Link>
            <Link to={ ROUTE_ALBUM_UPLOAD } className="btn btn-lg btn-block btn-default">上传作品</Link>
            <Link to={ ROUTE_ACCOUNT_INFO } className="btn btn-lg btn-block btn-default">完善资料</Link>
          </div>
          <div className="row">
            <div className="col-lg-6">
              <QRCode value={ userHomePage } size={ 128 } />
              <div>个人主页</div>
            </div>
            <div className="col-lg-6">
              <img src="img/qrcode_dingyue.jpg" width="128" />
              <div>微信订阅号</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
})

export default UserPanel
