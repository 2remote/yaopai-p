var React = require('react');
var { Router, Route, IndexRoute, IndexRedirect, Redirect } = require('react-router');
import NF404 from './components/root/404';

var Layout = require('./components/layout');
var Home = require('./components/home');
// var Login = require('./components/loginPanel');
// var Register = require('./components/registerPanel');
var AccountCenter = require('./components/accountCenter');
// var Photographer = require('./components/photographer/photographer');
var PersonInfo = require('./components/personInfo');
var AccountInfo = require('./components/accountInfo');
var UploadWorks = require('./components/uploadWorks');
var OrderManager = require('./components/orderManager');
var Albums = require('./components/albums/index');
var Provision = require('./components/provision');
import AuthContainer from './components/auth/AuthContainer'
/* ********************************认证******************************** */
import AuthSummary from './components/auth/AuthSummary' // 总览
import AuthBasic from './components/auth/AuthBasic' // 基本信息
import AuthRealName from './components/auth/AuthRealName' // 实名认证
import AuthPhotographer from './components/auth/AuthPhotographer' // 摄影师专业认证
import AuthMakeupArtist from './components/auth/AuthMakeupArtist' // 化妆师专业认证
import AuthMote from './components/auth/AuthMote' // 模特专业认证
import AuthResult from './components/auth/AuthResult' // 结果

import Content from './components/root/Content'
import AlbumInfo from './components/root/AlbumInfo'

var routes = (
	<Router>
		<Route path="/" component={Content}>
      <IndexRedirect to="main" />
      <Route path="main" component={AlbumInfo} comment="首页，作品信息" />
			<Route path="/account" component={AccountCenter} >
				<IndexRedirect to="personInfo" />
				<Route path="personInfo" component={PersonInfo} />
				{/*<Route path="photographer" component={Photographer} />*/}
				<Route path="info" component={AccountInfo} />
				<Route path="upload" component={UploadWorks} />
			</Route>
			<Route path="order/:type/:state" component={OrderManager} />
			<Route path="albums/:id" component={Albums} />
			<Route path="provision" component={Provision} />
      {/* ****************认证页信息**************** */}
      <Route path="auth" component={AuthContainer} comment="认证页信息" >
        <IndexRoute component={AuthSummary} />
        <Route path="basic" component={AuthBasic} />
        <Route path="real" component={AuthRealName} />
        <Route path="p" component={AuthPhotographer} />
        <Route path="a" component={AuthMakeupArtist} />
        <Route path="m" component={AuthMote} />
        <Route path="result" component={AuthResult} />
      </Route>
		</Route>
    <Route path="/login" component={Home} comment="登录注册页" />
    <Route path="/404" component={NF404} comment="默认未知页" />
    <Redirect from="*" to="/404" />
	</Router>
);

/* TODO: 改版啦改版啦 */
// var Content = require('./components/root/Content');
// var Main = require('./components/root/Main');
// var NF404 = require('./components/root/404');
//
// routes = (
//   <Router>
//     <Route path="/" component={ Content }>
//       <IndexRoute component={ Main } comment="默认首页" />
//       <Route path="account" comment="帐号相关">
//         <IndexRedirect to="info" />
//         <Route path="info" component={NF404} comment="修改信息" />
//         <Route path="password" component={NF404} comment="修改密码" />
//       </Route>
//       <Route path="auth" comment="认证相关">
//         <IndexRoute component={NF404} comment="认证-总览" />
//         <Route path="basic" component={NF404} comment="认证-基本信息" />
//         <Route path="real" component={NF404} comment="认证-实名认证" />
//         <Route path="p" component={NF404} comment="认证-摄影师" />
//         <Route path="a" component={NF404} comment="认证相关" />
//         <Route path="m" component={NF404} comment="认证相关" />
//         <Route path="result" component={NF404} comment="认证相关" />
//       </Route>
//       <Route path="album" comment="作品相关">
//         <IndexRedirect to="upload"/>
//         <Route path="upload" component={NF404}  comment="作品上传" />
//         <Route path="detail/:aid" component={NF404} comment="作品详情" />
//       </Route>
//       <Route path="order" comment="订单相关">
//         <IndexRoute component={NF404} />
//       </Route>
//     </Route>
//     <Route path="/user" comment="用户相关">
//       <IndexRedirect to="login" />
//       <Route path="login" component={NF404} comment="登录" />
//       <Route path="register" component={NF404} comment="注册" />
//       <Route path="provision" component={NF404} comment="条款" />
//     </Route>
//     <Route path="/404" component={NF404} comment="默认未知页" />
//     <Redirect from="*" to="/404" />
//   </Router>
// );

exports.start = function() {
		React.render(routes, document.getElementById('content'));
}
