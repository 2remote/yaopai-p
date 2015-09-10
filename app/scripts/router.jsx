var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var Layout = require('./components/layout');
var Home = require('./components/home');
var About = require('./components/about');
var Login = require('./components/loginPanel');
var Register = require('./components/registerPanel');
var PhotographerAuth = require('./components/photographerAuth');
var routes = (
	<Route name="homeLayout" path="/" handler={Layout}>
		<DefaultRoute handler={Home} />
		<Route name="about" handler={About} />
		<Route name="login" handler={Login} />
		<Route name="register" handler={Register} />
		<Route name="pAuth" handler={PhotographerAuth} />
	</Route>
	
);

exports.start = function() {
  
  Router.run(routes, function (Handler) {
		React.render(<Handler />, document.getElementById('content'));
	});
}
