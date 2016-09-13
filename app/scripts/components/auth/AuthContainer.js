import React from 'react'
import Reflux from 'reflux'
var InfoHeader = require('../infoHeader');
var ToolTip = require('../toolTip');

/* 用户 */
import UserAccountStore from '../../stores/UserAccountStore'
/* 实名信息 */
var { RealNameStore, REALNAME_DEFAULT, REALNAME_APPROVE, REALNAME_PENDING }
  = require('../../stores/RealNameStore');
/* 专业认证信息 - 摄影师 */
import { PhotographerAuthStore, PHOTOGRAPHER_AUTH_DEFAULT, PHOTOGRAPHER_AUTH_APPROVE, PHOTOGRAPHER_AUTH_PENDING }
  from '../../stores/auth/PhotographerAuthStore'
/* 专业认证信息 - 化妆师 */
var { MakeupArtistAuthStore, MAKEUPARTIST_AUTH_DEFAULT, MAKEUPARTIST_AUTH_APPROVE, MAKEUPARTIST_AUTH_PENDING }
  = require('../../stores/auth/MakeupArtistAuthStore');
/* 专业认证信息 - 模特 */
var { MoteAuthStore, MOTE_AUTH_DEFAULT, MOTE_AUTH_APPROVE, MOTE_AUTH_PENDING }
  = require('../../stores/auth/MoteAuthStore');

var AccountActions = require('../../actions/AccountActions');
var AuthAction = require('../../actions/AuthAction');

var isAuthed = function(status, magic) {
  if(magic === 0) { // real name
    return status === REALNAME_DEFAULT ||
      status === REALNAME_PENDING ||
      status === REALNAME_APPROVE
  } else if(magic === 1) { // photographer
    return status === PHOTOGRAPHER_AUTH_DEFAULT ||
      status === PHOTOGRAPHER_AUTH_PENDING ||
      status === PHOTOGRAPHER_AUTH_APPROVE
  } else if (magic === 2) { // makeup artist
    return status === MAKEUPARTIST_AUTH_DEFAULT ||
      status === MAKEUPARTIST_AUTH_PENDING ||
      status === MAKEUPARTIST_AUTH_APPROVE
  } else if (magic === 3) { // mote
    return status === MOTE_AUTH_DEFAULT ||
      status === MOTE_AUTH_PENDING ||
      status === MOTE_AUTH_APPROVE
  } else {
    console.error('传入了错误的参数！')
  }
};

var AuthContainer = React.createClass({
  mixins: [
    Reflux.connect(UserAccountStore, 'userAccount'),
    Reflux.connect(RealNameStore, 'realName'),
    Reflux.connect(PhotographerAuthStore, 'authPhotographer'),
    Reflux.connect(MakeupArtistAuthStore, 'authMakeupArtist'),
    Reflux.connect(MoteAuthStore, 'authMote')
  ],
  getInitialState: function() {
    return {
      authTarget: '',
    }
  },
  componentWillMount: function() {
    console.log("AuthContainer:",this.state)

    //组件即将加载前,重新获取认证状态
    AuthAction.viewPhotographerAudit();
    AuthAction.viewMakeupArtistAudit();
    AuthAction.viewMoteAudit();

    // 认证状态为默认，表示未向服务器获取认证信息
    if(this.state.realName.status === REALNAME_DEFAULT) {
      AccountActions.userDetail()
    }

    if(this.state.authPhotographer.status === PHOTOGRAPHER_AUTH_DEFAULT) {
      AuthAction.viewPhotographerAudit()
    }
    if(this.state.authMakeupArtist.status === MAKEUPARTIST_AUTH_DEFAULT) {
      AuthAction.viewMakeupArtistAudit()
    }
    if(this.state.authMote.status === MOTE_AUTH_DEFAULT) {
      AuthAction.viewMoteAudit()
    }
  },
  showMessage: function(message) {
    this.refs.toolTip.toShow(message)
  },
  render: function() {
    var style = {
      outer: {
        backgroundColor: '#fff',
        padding: '40px 60px 70px 60px',
        color: '#777777',
      },
    }
    return (
    <div style={style.outer}>
      {/* 传信息给children */}
      {/* https://github.com/reactjs/react-router/blob/master/examples/passing-props-to-children/app.js */}
      {this.props.children && React.cloneElement(this.props.children, {
        /* 给Summary用 */
        userComplete: this.state.userAccount.basic.complete,
        realNameComplete: isAuthed(this.state.realName.status, 0),
        photographerAuthed: isAuthed(this.state.authPhotographer.status, 1),
        makeupArtistAuthed: isAuthed(this.state.authMakeupArtist.status, 2),
        moteAuthed: isAuthed(this.state.authMote.status, 3),
        /* 全信息 */
        userAccount: this.state.userAccount,
        realName: this.state.realName,
        authPhotographer: this.state.authPhotographer,
        authMakeupArtist: this.state.authMakeupArtist,
        authMote: this.state.authMote,
        /* 要认证的目标 */
        authTarget: this.state.authTarget,
        changeAuthTarget: this.changeAuthTarget,
        showMessage: this.showMessage,
      })}
      <ToolTip ref="toolTip" title=""/>
    </div>
    )
  },
  changeAuthTarget: function(target) {
    this.setState({
      authTarget: target,
    })
  },
})

export default AuthContainer
