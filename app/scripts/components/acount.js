var React = require('react');
var Reflux = require('reflux');
var UserStore = require('../stores/UserStore');
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
  getContent : function(){
  	if(this.state.currentUser.isLogin){
		return (
      <ul className= "nav navbar-nav pull-right">
        <li>
          <Link to="/pAuth"><img src="img/camera.png" /></Link>
        </li>
        <li>
          <Link to="/pAuth"><img src="img/user.png" /></Link>
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