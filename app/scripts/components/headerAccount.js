/**
 * headerAccount
**/
var React = require('react');
var Reflux = require('reflux');
var UserStore = require('../stores/UserStore');
var UserAccountStore = require('../stores/UserAccountStore');
var UserActions = require('../actions/UserActions');
var { Link, History } = require('react-router');

var NavMenuItem = React.createClass({
  mixins: [History],
  render: function() {
    const { target, icon, text, visible } = this.props;
    if(!visible) {
      // http://stackoverflow.com/questions/30097091/correct-way-to-define-an-empty-dom-element-in-react
      return null;
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
    );
  },
});

var Acount = React.createClass({
  mixins: [Reflux.connect(UserAccountStore, 'currentUser'), History],
  handleLogout: function () {
    UserActions.logout(true);
  },
  render: function () {
    return (
      <div className="right-header-nav">
        <div>
          <ul className="nav navbar-nav">
            {/*我的主页*/}
            <NavMenuItem target="/profile" icon="glyphicon glyphicon-home" text="我的主页" visible={ true }/>
            {/*作品上传：visible={ this.state.currentUser.basic.professions.photographer }*/}
            <NavMenuItem target="/account/upload" icon="glyphicon glyphicon-upload" text="作品上传" visible={ true } />
            {/*入驻邀拍*/}
            <NavMenuItem target="/account/auth" icon="glyphicon glyphicon-camera" text="入驻邀拍" visible={ true } />
            {/*修改密码*/}
            <NavMenuItem target="/account/info" icon="glyphicon glyphicon-cog" text="修改密码"
              visible={ this.state.currentUser.basic.professions.photographer }
            />
            {/*账户设置*/}
            <NavMenuItem target="/account/personInfo" icon="glyphicon glyphicon-cog" text="账户设置" visible={ true } />
          </ul>
          {/*导航-右侧*/}
          <ul className="nav navbar-nav navbar-right">
            <li onClick={this.handleLogout}>
              <Link to="/">
                <span className="glyphicon glyphicon-log-out" aria-hidden="true"></span> 登出
              </Link>
            </li>
          </ul>
        </div>
      </div>
    );
  }
});

module.exports = Acount;
