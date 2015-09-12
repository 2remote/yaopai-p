var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var Layout = require('./components/layout');
var Home = require('./components/home');
var About = require('./components/about');
var Login = require('./components/loginPanel');
var Register = require('./components/registerPanel');
var AccountCenter = require('./components/accountCenter');
var PhotographerAuth = require('./components/photographerAuth');
var PersonInfo = require('./components/personInfo');
var AccountInfo = require('./components/accountInfo');


var routes = (
	<Route name="homeLayout" path="/" handler={Layout}>
		<DefaultRoute handler={Home} />
		<Route name="about" handler={About} />
		<Route name="login" handler={Login} />
		<Route name="register" handler={Register} />
		<Route name="account" handler={AccountCenter} >
			<Route name="personInfo" handler={PersonInfo} />
			<Route name="pAuth" handler={PhotographerAuth} />
			<Route name="info" handler={AccountInfo} />
		</Route>
	</Route>
	
);

exports.start = function() {
  
  Router.run(routes, function (Handler) {
		React.render(<Handler />, document.getElementById('content'));
	});
}
