var React = require('react');
var Reflux = require('reflux');
var UserStore = require('../stores/UserStore');
var UserActions = require('../actions/UserActions');
var Router = require('react-router');
var Link  = Router.Link;

var LoginPanel = require('./loginPanel');
var RegisterPanel = require('./registerPanel');


var Acount = React.createClass({
	mixins: [Reflux.listenTo(UserStore, 'onStatusChange')],
	getInitialState: function () {
      return {currentUser : UserStore.userData};
  },
  onStatusChange: function (data) {
      this.setState({currentUser : data});
  },
  componentDidMount: function () {
      this.unsubscribe = UserStore.listen(this.onStatusChange);
  },
  componentWillUnmount: function () {
      this.unsubscribe();
  },
  handleLogout : function () {
    console.log('click logout');
    UserActions.logout(true);
  },
  handleLogin : function(){
    this.refs.registerModal.close();
    var loginModal = this.refs.loginModal;
    loginModal.open();
  },
  handleRegister : function(){
    this.refs.loginModal.close();
    var registerModal = this.refs.registerModal;
    registerModal.open();
  },
  getContent : function(){
    var headerStyle= {
      liStyle : {
        height : '50px',
        width : '40px',
        paddingTop : '15px'
      },
      loginBtn : {
        color : '#eeeeee',
        cursor : 'pointer',
        marginRight :'20px',
        marginTop : '10px',
      },
      logoutBtn : {
        display: 'block',
        padding: '3px 20px',
        clear: 'both',
        fontWeight: '400',
        lineHeight: '1.42857143',
        color: '#333',
        whiteSpace: 'nowrap',
        cursor : 'pointer',
      }
    };

  	if(this.state.currentUser.isLogin){
		return (
      <ul className= "nav navbar-nav navbar-right  right-header-nav">
        <li style={headerStyle.liStyle}>
          <Link to="/account/pAuth">
            <img height="20" src="img/camera.png" />
          </Link>
        </li>
        <li style={headerStyle.liStyle}>
          <Link to="/account/upload">
            <img height="20" src="img/shangchuan.png" />
          </Link>
        </li>
        <li className="dropdown">
          <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
            <img height="40" src="img/default_user_img_o.png" />
          </a>
          <ul className="dropdown-menu">
            <li>
              <Link to="/profile/onSale">
              <span className="glyphicon glyphicon-home" aria-hidden="true"></span>  我的主页
              </Link>
            </li>
            <li>
              <Link to="/order/myInquiry">
                <span className="glyphicon glyphicon-file" aria-hidden="true"></span>  订单管理
              </Link>
            </li>
            <li>
              <Link to="/account">
                <span className="glyphicon glyphicon-cog" aria-hidden="true"></span>  账户设置
              </Link>
            </li>
            <li role="separator" className="divider"></li>
            <li style={headerStyle.logoutBtn} onClick={this.handleLogout}>
                <span className="glyphicon glyphicon-log-out" aria-hidden="true"></span>  登出
            </li>
          </ul>
        </li>
      </ul>
      )
	}else{
		return (
				<ul className= "nav navbar-nav navbar-right">
					<li style={headerStyle.loginBtn} onClick={this.handleLogin}>
              <span className="glyphicon glyphicon-log-in" aria-hidden="true"></span>  登录
          </li>
				</ul>
			)
	}
  },
	render : function(){
		return(
				<div className="right-header-nav">
  				{
  					this.getContent()
  				}
          <LoginPanel ref="loginModal" register={this.handleRegister} />
          <RegisterPanel ref="registerModal" login={this.handleLogin}/>
				</div>
			
		);
	}
});

module.exports = Acount;