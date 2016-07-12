import React from 'react'
import { Link } from 'react-router'

const AuthResult = React.createClass({
  render: function() {
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
          <Link to="/account/upload" className="btn btn-block btn-default">上传作品</Link>
        </div>
      </div>
    );
  },
})

export default AuthResult
