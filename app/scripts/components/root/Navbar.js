import React from 'react'
import Reflux from 'reflux'
import { Link, History } from 'react-router'

var UserStore = require('../../stores/UserStore')
var UserAccountStore = require('../../stores/UserAccountStore')
var UserActions = require('../../actions/UserActions')
import { PHOTOGRAPHER_AUTH_DEFAULT, PHOTOGRAPHER_AUTH_NONE, PhotographerAuthStore } from '../../stores/auth/PhotographerAuthStore'
import AuthAction from '../../actions/AuthAction'

import { ROUTE_LOGIN, ROUTE_MAIN, ROUTE_AUTH } from '../../routeConfig'

console.log('吓死宝宝了！@.@', ROUTE_MAIN, ROUTE_AUTH)

import Account from './headerAccount'

const NavMenuItem = React.createClass({
  mixins: [History],
  render: function() {
    const { target, icon, text, visible } = this.props
    if(!visible) {
      // http://stackoverflow.com/questions/30097091/correct-way-to-define-an-empty-dom-element-in-react
      return null
    }
    // 说好了history.isActive(target, true)的，怎么就都是false了？
    // 应对这个旧版react-router的bug，把router的 /account IndexRoute改成了IndexRedirect到了personInfo
    // https://github.com/reactjs/react-router/blob/master/docs/API.md#isactivepathorloc-indexonly
    return (
      <li className={ this.history.isActive(target) ? 'active' : '' }>
        <Link to={ target }>
          <span className={ icon } aria-hidden="true"></span> { text }
        </Link>
      </li>
    )
  },
})


const Header = React.createClass({
  mixins: [
    Reflux.connect(UserAccountStore, 'currentUser'),
    Reflux.connect(PhotographerAuthStore, 'photographerAuth'),
    History
  ],
  getInitialState: function() {
    return {
      fetchOnce: false,
    }
  },
  handleLogout: function () {
    UserActions.logout(true)
  },
  componentWillMount: function() {
    if(!this.state.currentUser.isLogin) {
      this.history.pushState(null, ROUTE_LOGIN)
    }
    // 获取一次摄影师认证信息
    if(this.state.photographerAuth.status === PHOTOGRAPHER_AUTH_DEFAULT && !this.state.fetchOnce) {
      AuthAction.viewPhotographerAudit()
      this.setState({ fetchOnce: true, })
    }
  },
  render: function() {
    let showUpload = !(this.state.photographerAuth.status === PHOTOGRAPHER_AUTH_DEFAULT
      || this.state.photographerAuth.status === PHOTOGRAPHER_AUTH_NONE)
    return(
      <nav className="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed"
              data-toggle="collapse" data-target="#header-nav" aria-expanded="false"
            >
              <span className="sr-only"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <Link to="/" className="navbar-brand">
              <img style={{ height: '90%' }} src="img/logo.png" />
            </Link>
          </div>
          <div className="collapse navbar-collapse" id="header-nav">
            <ul className="nav navbar-nav">
              {/*我的主页*/}
              <NavMenuItem target={ ROUTE_MAIN } icon="glyphicon glyphicon-home" text="我的主页" visible={ true }/>
              {/*入驻邀拍*/}
              <NavMenuItem target={ ROUTE_AUTH } icon="glyphicon glyphicon-camera" text="入驻邀拍" visible={ true } />
              {/*作品上传：visible={ this.state.currentUser.basic.professions.photographer }*/}
              <NavMenuItem target="/account/upload" icon="glyphicon glyphicon-upload" text="上传作品" visible={ showUpload } />
              {/*修改密码*/}
              <NavMenuItem target="/account/info" icon="glyphicon glyphicon-cog" text="修改密码"
                visible={ this.state.currentUser.basic.professions.photographer }
              />
              {/*账户设置*/}
              <NavMenuItem target="/account/personInfo" icon="glyphicon glyphicon-cog" text="个人信息" visible={ true } />
            </ul>
            {/*导航-右侧*/}
            <ul className="nav navbar-nav navbar-right">
              <li>
                <a onClick={this.handleLogout}>
                  <span className="glyphicon glyphicon-log-out" aria-hidden="true"></span> 登出
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    )
  }
})

export default Header
