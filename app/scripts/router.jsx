var React = require('react');
var ReactRouter = require('react-router')
var Router = ReactRouter.Router
var Route = ReactRouter.Route
var Link = ReactRouter.Link;
var IndexRoute = ReactRouter.IndexRoute;
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
	<Router>
		<Route path="/" component={Layout}>
			<IndexRoute component={Home} />
			<Route path="login" component={Login} />
			<Route path="register" component={Register} />
			<Route path="/account" component={AccountCenter} >
				<IndexRoute component={PersonInfo} />
				<Route path="personInfo" component={PersonInfo} />
				<Route path="pAuth" component={PhotographerAuth} />
				<Route path="info" component={AccountInfo} />
			</Route>
		</Route>
	</Router>
	
);

exports.start = function() {
  
		React.render(routes, document.getElementById('content'));
}
