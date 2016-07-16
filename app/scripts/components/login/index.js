import React from 'react'
import Reflux from 'reflux'
import { History } from 'react-router'

/* data (from stores) and ations */
import UserAccountStore from '../../stores/UserAccountStore'
import UserAccountAction from '../../actions/user/UserAccountAction'

const Login = React.createClass({
  mixins: [
    Reflux.connect(UserAccountStore, 'user'),
    History
  ],
  render: function() {
    return (
      <div className="container-fluid">
        <div className="col-sm-7 hidden-xs"></div>
        <div className="col-sm-5" style={{border: '1px solid red'}}>
          这里是表单
        </div>
      </div>
    )
  },
})

export default Login
