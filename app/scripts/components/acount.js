var React = require('react');
var Reflux = require('reflux');
var UserStore = require('../stores/userStore');

var LoginButton = React.createClass({
	render : function(){
		return (
				<li><a href="#">登录</a></li>
			);
	}
});

var RegisterButton = React.createClass({
	render : function(){
		return (
				<li><a href="#">注册</a></li>
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
    	if(this.state.isLogin){
			return <li>已登录{this.state.currentUser.userName}</li>
		}else{
			return (
				<ul className= "nav navbar-nav navbar-right">
					<LoginButton />
					<RegisterButton />
				</ul>)
		}
    },
	render : function(){
		return(
			<li>
				{
					this.getContent()
				}
			</li>
		);
	}
});

module.exports = Acount;