import React, { PropTypes } from 'react'
import defaultUserImg from 'image/default_user_img.png'
import qrCodeImg from 'image/qrcode_dingyue.jpg'
import { Link } from 'react-router'
import QRCode from 'qrcode.react'

import { ROUTE_AUTH, ROUTE_ACCOUNT_INFO, ROUTE_UPLOAD_SUMMARY } from 'util/routeConfig'

const UserPanel = ({ user }) => (
  <div className="panel panel-default">
    <div className="panel-body text-center">
      <div className="thumbnail" style={{ marginBottom: 50, border: 'none' }}>
        <img
          style={{
            width: '125px',
            height: '125px',
            marginTop: '50px',
          }}
          alt={user.basic.nickname}
          src={user.basic.avatar || defaultUserImg}
          className="img-circle"
        />
        <div className="caption">
          <h4>{ user.basic.nickname }</h4>
          <p className="signature">{ user.basic.signature ? user.basic.signature : '还没有签名' }</p>
        </div>
      </div>
      <div style={{ marginBottom: 50 }}>
        <Link to={ROUTE_AUTH} className="btn btn-lg btn-block btn-info">我要认证</Link>
        <Link to={ROUTE_UPLOAD_SUMMARY} className="btn btn-lg btn-block btn-default">作品上传</Link>
        <Link to={ROUTE_ACCOUNT_INFO} className="btn btn-lg btn-block btn-default">个人信息</Link>
      </div>
      <div className="row">
        <div className="col-lg-6">
          <QRCode value={`http://m.aiyaopai.com/#/grapherDetail/${user.basic.id}`} size={128} />
          <div>个人主页</div>
        </div>
        <div className="col-lg-6">
          <img alt="YAOPAI" src={qrCodeImg} width="128" />
          <div>微信订阅号</div>
        </div>
      </div>
    </div>
  </div>
)

UserPanel.propTypes = {
  user: PropTypes.object,
}

export default UserPanel
