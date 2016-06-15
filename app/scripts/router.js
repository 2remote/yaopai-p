var React = require('react');
var { Router, Route, IndexRoute, IndexRedirect } = require('react-router');

var Layout = require('./components/layout');
var Home = require('./components/home');
// var Login = require('./components/loginPanel');
// var Register = require('./components/registerPanel');
var AccountCenter = require('./components/accountCenter');
var Photographer = require('./components/photographer/photographer');
var PersonInfo = require('./components/personInfo');
var AccountInfo = require('./components/accountInfo');
var UploadWorks = require('./components/uploadWorks');
var OrderManager = require('./components/orderManager');
var Profile = require('./components/profile');
var Albums = require('./components/albums/index');
var Provision = require('./components/provision');
var AuthContainer = require('./components/auth/AuthContainer');
/* 认证：总揽 */
var AuthSummary = require('./components/auth/AuthSummary');
/* 认证：基本信息 */
var AuthBasic = require('./components/auth/AuthBasic');
/* 认证：实名认证 */
var AuthRealName = require('./components/auth/AuthRealName');
/* 认证：摄影师专业认证 */
var AuthPhotographer = require('./components/auth/AuthPhotographer');
/* 认证：化妆师专业认证 */
var AuthMakeupArtist = require('./components/auth/AuthMakeupArtist');
/* 认证：模特专业认证 */
var AuthMote = require('./components/auth/AuthMote');
/* 认证：结果 */
var AuthResult = require('./components/auth/AuthResult');

var routes = (
	<Router>
		<Route path="/" component={Layout}>
			<IndexRoute component={Home} />
			{/*<Route path="login" component={Login} />*/}
			{/*<Route path="register" component={Register} />*/}
			<Route path="/account" component={AccountCenter} >
				<IndexRoute component={PersonInfo} />
				<Route path="personInfo" component={PersonInfo} />
        <Route path="auth" component={AuthContainer}>
          <IndexRoute component={AuthSummary} />
          <Route path="basic" component={AuthBasic} />
          <Route path="real" component={AuthRealName} />
          <Route path="p" component={AuthPhotographer} />
          <Route path="a" component={AuthMakeupArtist} />
          <Route path="m" component={AuthMote} />
          <Route path="result" component={AuthResult} />
        </Route>
				<Route path="photographer" component={Photographer} />
				<Route path="info" component={AccountInfo} />
				<Route path="upload" component={UploadWorks} />
			</Route>
			<Route path="order/:type/:state" component={OrderManager} />
			<Route path="profile/:type" component={Profile} />
			<Route path="albums/:id" component={Albums} />
			<Route path="provision" component={Provision} />
		</Route>
	</Router>

);

exports.start = function() {
		React.render(routes, document.getElementById('content'));
}
