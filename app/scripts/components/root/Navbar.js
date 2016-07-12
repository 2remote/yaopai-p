import React from 'react'
import Reflux from 'reflux'
import { Link, History } from 'react-router'

import {
  ROUTE_ROOT, ROUTE_MAIN, ROUTE_AUTH, ROUTE_ALBUM_UPLOAD,
  ROUTE_ACCOUNT_PASSWORD, ROUTE_ACCOUNT_INFO, ROUTE_ACCOUNT_MOTE,
} from '../../routeConfig'

/**
 * <ul className="nav navbar-nav">下的每一个li
**/
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

/**
 * Bootstrap的navbar
**/
const Navbar = React.createClass({
  render: function() {
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
            <Link to={ ROUTE_ROOT } className="navbar-brand">
              <img style={{ height: '90%' }} src="img/logo.png" />
            </Link>
          </div>
          <div className="collapse navbar-collapse" id="header-nav">
            <ul className="nav navbar-nav">
              {/*我的主页*/}
              <NavMenuItem target={ ROUTE_MAIN } icon="glyphicon glyphicon-home" text="我的主页" visible={ true }/>
              {/*入驻邀拍*/}
              {/*<NavMenuItem target={ ROUTE_AUTH } icon="glyphicon glyphicon-camera" text="入驻邀拍" visible={ true } />*/}
              {/*作品上传：visible={ this.state.currentUser.basic.professions.photographer }*/}
              {/*<NavMenuItem target={ ROUTE_ALBUM_UPLOAD } icon="glyphicon glyphicon-upload" text="上传作品" visible={ this.props.photographerAuthed } />*/}
              {/*修改密码*/}
              <NavMenuItem target={ ROUTE_ACCOUNT_PASSWORD } icon="glyphicon glyphicon-cog" text="修改密码" visible={ true } />
              {/*账户设置*/}
              {/* <NavMenuItem target={ ROUTE_ACCOUNT_INFO } icon="glyphicon glyphicon-cog" text="个人信息" visible={ true } />*/}
              {/* TODO: 模特信息录入-临时 */}
              {/* <NavMenuItem target={ ROUTE_ACCOUNT_MOTE } icon="glyphicon glyphicon-cog" text="呢骄傲" visible={ true } />*/}
            </ul>
            {/*导航-右侧*/}
            <ul className="nav navbar-nav navbar-right">
              <li>
                <a onClick={ this.props.logout }>
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

export default Navbar
