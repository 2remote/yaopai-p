var React = require('react');
var Reflux = require('reflux');
var UserStore = require('../stores/UserStore');
var UserActions = require('../actions/UserActions');
var Router = require('react-router');
var Link = Router.Link;
var History = Router.History;

var LoginPanel = require('./loginPanel');
var RegisterPanel = require('./registerPanel');


var Acount = React.createClass({
  mixins: [Reflux.listenTo(UserStore, 'onStatusChange'), History],
  getInitialState: function () {
    return {currentUser: UserStore.userData};
  },
  onStatusChange: function (data) {
    this.setState({currentUser: data});
  },
  componentDidMount: function () {
    this.unsubscribe = UserStore.listen(this.onStatusChange);
  },
  componentWillUnmount: function () {
    this.unsubscribe();
  },
  handleLogout: function () {
    console.log('click logout');
    UserActions.logout(true);
  },
  handleLogin: function () {
    this.refs.registerModal.close();
    var loginModal = this.refs.loginModal;
    loginModal.open();
  },
  handleRegister: function () {
    this.refs.loginModal.close();
    var registerModal = this.refs.registerModal;
    registerModal.open();
  },
  getContent: function () {
    var headerStyle = {
      liStyle: {
        lineHeight: '50px',
        padding: '0 10px',
      },
      personCenter: {
        padding: '0 10px',
        marginRight: '10px',
        lineHeight: '50px',
      },
      loginBtn: {
        color: '#eeeeee',
        cursor: 'pointer',
        marginRight: '20px',
      },
      logoutBtn: {
        // display: 'block',
        // padding: '3px 20px',
        // fontWeight: '400',
        // lineHeight: '1.42857143',
        // color: '#333',
        // whiteSpace: 'nowrap',
        // cursor : 'pointer',
      },
      avatar: {
        borderRadius: '50%',
      },
      hide: {
        display: 'none',
      }
    };

    if (this.state.currentUser.isLogin) {
      //头像个人中心按钮去掉 2015-12-15
      //<li>
      //  <a href="javascript:void(0);" title="个人中心" style={headerStyle.personCenter}>
      //    <img height="40" style= {headerStyle.avatar}
      //         src={this.state.currentUser.avatar? this.state.currentUser.avatar+'?imageMogr2/gravity/Center/thumbnail/!40x40r/crop/40x40/interlace/1' :"img/default_user_img_o.png"} />
      //  </a>
      //</li>
      return (
        <div>
          <ul className="nav navbar-nav">
            <li style={this.state.currentUser.userType==0? headerStyle.liStyle : headerStyle.hide}>
              <Link to="/account/pAuth">
                <span className="glyphicon glyphicon-camera" aria-hidden="true"></span> 摄影师认证
              </Link>
            </li>
            <li>
              <Link to="/profile/onSale">
                <span className="glyphicon glyphicon-home" aria-hidden="true"></span> 我的主页
              </Link>
            </li>
            <li style={this.state.currentUser.userType==1? headerStyle.liStyle : headerStyle.hide}>
              <Link to="/account/upload" title="作品上传">
                <span className="glyphicon glyphicon-upload" aria-hidden="true"></span> 作品上传
              </Link>
            </li>
            <li>
              <Link to="/order/in/pending">
                <span className="glyphicon glyphicon-file" aria-hidden="true"></span> 订单管理
              </Link>
            </li>
            <li>
              <Link to="/account">
                <span className="glyphicon glyphicon-cog" aria-hidden="true"></span> 账户设置
              </Link>
            </li>
          </ul>
          <ul className="nav navbar-nav navbar-right">
            <li style={headerStyle.logoutBtn} onClick={this.handleLogout}>
              <Link to="/">
                <span className="glyphicon glyphicon-log-out" aria-hidden="true"></span> 登出
              </Link>
            </li>
          </ul>
        </div>
      )
    } else {
      return (
        <ul className="nav navbar-nav navbar-right">
          <li style={headerStyle.loginBtn}>
            <Link to="/" title="登录" style={headerStyle.liStyle}>登录</Link>
          </li>
        </ul>
      )
    }
  },
  render: function () {
    return (
      <div className="right-header-nav">
        {
          this.getContent()
        }
        <LoginPanel ref="loginModal" register={this.handleRegister}/>
        <RegisterPanel ref="registerModal" login={this.handleLogin}/>
      </div>
    );
  }
});

module.exports = Acount;