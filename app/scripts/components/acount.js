var React = require('react');
var Reflux = require('reflux');
var UserStore = require('../stores/UserStore');
var UserActions = require('../actions/UserActions');
var Router = require('react-router');
var Link  = Router.Link;

var LoginButton = React.createClass({
	render : function(){
		return (
			<li>
				<Link to="/login">登录</Link>
			</li>
		);
	}
});

var RegisterButton = React.createClass({
	render : function(){
		return (
			<li>
				<Link to = "/register"><img src="img/user.png" /></Link>
			</li>
		);
	}
});

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
    Na
  },
  getContent : function(){
  	if(this.state.currentUser.isLogin){
		return (
      <ul className= "nav navbar-nav navbar-right">
        <li className="dropdown">
          <Link to="/account/pAuth">
            <img src="img/camera.png" />
          </Link>
        </li>
        <li className="dropdown">
          <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">
            <img height="40" src="img/default_user_img_o.png" />
          </a>
          <ul className="dropdown-menu">
            <li><Link to="/account">我的主页</Link></li>
            <li><Link to="/account">订单管理</Link></li>
            <li><Link to="/account">账户设置</Link></li>
            <li role="separator" className="divider"></li>
            <li><a href="#" onClick={this.handleLogout}>登出</a></li>
          </ul>
        </li>
      </ul>
      )
	}else{
		return (
				<ul className= "nav navbar-nav pull-right">
					<RegisterButton />
				</ul>
			)
	}
  },
	render : function(){
		return(
				<div className="nav nav-header pull-right">
				{
					this.getContent()
				}
				</div>
			
		);
	}
});

module.exports = Acount;