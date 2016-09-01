import React from 'react'
import { Link } from 'react-router'
import {
  ROUTE_AUTH_PHOTOGRAPHER,
  ROUTE_AUTH_MAKEUPARTIST,
  ROUTE_AUTH_MOTE,
  ROUTE_UPLOAD_SUMMARY,
  ROUTE_UPLOAD_PHOTOGRAPHER,
  ROUTE_UPLOAD_MOTE,
  ROUTE_UPLOAD_MAKEUPARTIST,
} from '../../routeConfig'

const AuthResult = React.createClass({
  render: function() {
    const target = this.props.authTarget
    let routeSpecific =
      target === ROUTE_AUTH_PHOTOGRAPHER ? ROUTE_UPLOAD_PHOTOGRAPHER :
      target === ROUTE_AUTH_MAKEUPARTIST ? ROUTE_UPLOAD_MAKEUPARTIST :
      target === ROUTE_AUTH_MOTE ? ROUTE_UPLOAD_MOTE : ROUTE_UPLOAD_SUMMARY
    // TODO: 临时抹掉上面的判断，等摄影师和化妆师可以上传的时候就删掉这个了
    routeSpecific = ROUTE_UPLOAD_SUMMARY
    return (
      <div className="text-center">
        <i className="icon renzheng" style={{
            color: '#E6C288',
            fontSize: 200,
          }}></i>
          <br />
        <strong>认证信息已提交审核</strong>
        <br />
        请耐心等待 1-2 个工作日。
        <br />
        现在您可以上传自己的作品，待认证审核通过后，将直接展示在 YAOPAI 产品库中
        <br /><br />
        <div style={{
            margin: 'auto',
            width: 220,
          }}>
          <Link to={ routeSpecific } className="btn btn-block btn-default">上传作品</Link>
        </div>
      </div>
    );
  },
})

export default AuthResult
