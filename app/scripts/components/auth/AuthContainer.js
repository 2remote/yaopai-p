var React = require('react');
var Reflux = require('reflux');

/* 用户 */
var UserAccountStore = require('../../stores/UserAccountStore');
/* 实名信息 */
var { RealNameStore, REALNAME_DEFAULT, REALNAME_APPROVE }
  = require('../../stores/RealNameStore');
/* 专业认证信息 */
var { PhotographerAuthStore, PHOTOGRAPHER_AUTH_DEFAULT, PHOTOGRAPHER_AUTH_APPROVE }
  = require('../../stores/auth/PhotographerAuthStore');
var { MakeupArtistAuthStore, MAKEUPARTIST_AUTH_DEFAULT, MAKEUPARTIST_AUTH_APPROVE }
  = require('../../stores/auth/MakeupArtistAuthStore');
var { MoteAuthStore, MOTE_AUTH_DEFAULT, MOTE_AUTH_APPROVE }
  = require('../../stores/auth/MoteAuthStore');

var AccountActions = require('../../actions/AccountActions');
var AuthAction = require('../../actions/AuthAction');

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
    };
  },
  componentWillMount: function() {
    //AuthAction.viewPhotographerAudit();
    //AuthAction.viewMakeupArtistAudit();
    //AuthAction.viewMoteAudit();
    // 认证状态为默认，表示未向服务器获取认证信息
    if(this.state.realName.status === REALNAME_DEFAULT) {
      AccountActions.userDetail();
    }
    if(this.state.authPhotographer.status === PHOTOGRAPHER_AUTH_DEFAULT) {
      AuthAction.viewPhotographerAudit();
    }
    if(this.state.authMakeupArtist.status === MAKEUPARTIST_AUTH_DEFAULT) {
      AuthAction.viewMakeupArtistAudit();
    }
    if(this.state.authMote.status === MOTE_AUTH_DEFAULT) {
      AuthAction.viewMoteAudit();
    }
  },
  render: function() {
    return (
      <div>
        Container<br />
        {/* 传信息给children */}
        {/* https://github.com/reactjs/react-router/blob/master/examples/passing-props-to-children/app.js */}
        {this.props.children && React.cloneElement(this.props.children, {
          /* 给Summary用 */
          userComplete: this.state.userAccount.basic.complete,
          realNameComplete: this.state.realName.status === REALNAME_APPROVE,
          photographerAuthed: this.state.authPhotographer.status === PHOTOGRAPHER_AUTH_APPROVE,
          makeupArtistAuthed: this.state.authMakeupArtist.status === MAKEUPARTIST_AUTH_APPROVE,
          moteAuthed: this.state.authMote.status === MOTE_AUTH_APPROVE,
          /* 全信息 */
          userAccount: this.state.userAccount,
          realName: this.state.realName,
          authPhotographer: this.state.authPhotographer,
          authMakeupArtist: this.state.authMakeupArtist,
          authMote: this.state.authMote,
          /* 要认证的目标 */
          authTarget: this.state.authTarget,
          changeAuthTarget: this.changeAuthTarget,
        })}
      </div>
    );
  },
  changeAuthTarget: function(target) {
    this.setState({
      authTarget: target,
    });
  },
});

module.exports = AuthContainer;
