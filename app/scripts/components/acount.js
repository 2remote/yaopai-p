var React = require('react');
var Reflux = require('reflux');
var UserStore = require('../stores/userStore');
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
				<Link to = "/register">注册</Link>
			</li>
		);
	}
});

var Acount = React.createClass({
	mixins: [Reflux.listenTo(UserStore, 'onStatusChange')],
	getInitialState: function () {
        return {currentUser : UserStore.data};
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
			return <li>已登录{this.state.currentUser.userName}</li>
		}else{
			return (
					<ul className= "nav navbar-nav navbar-right">
						<LoginButton />
						<RegisterButton />
					</ul>
				)
		}
    },
	render : function(){
		return(
				<div className="nav nav-header navbar-right">
				{
					this.getContent()
				}
				</div>
			
		);
	}
});

module.exports = Acount;