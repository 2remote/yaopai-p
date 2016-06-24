var React = require('react');
var { Router, Route, IndexRoute, IndexRedirect, Redirect } = require('react-router');
import NF404 from './components/root/404';

var Layout = require('./components/layout');
var Home = require('./components/home');
var AccountCenter = require('./components/accountCenter');
var PersonInfo = require('./components/personInfo');
var AccountInfo = require('./components/accountInfo');
var UploadWorks = require('./components/uploadWorks');
var OrderManager = require('./components/orderManager');
var Albums = require('./components/albums/index');
var Provision = require('./components/provision');
/* ********************************认证******************************** */
import AuthContainer from './components/auth/AuthContainer' // 认证容器
import AuthSummary from './components/auth/AuthSummary' // 总览
import AuthBasic from './components/auth/AuthBasic' // 基本信息
import AuthRealName from './components/auth/AuthRealName' // 实名认证
import AuthPhotographer from './components/auth/AuthPhotographer' // 摄影师专业认证
import AuthMakeupArtist from './components/auth/AuthMakeupArtist' // 化妆师专业认证
import AuthMote from './components/auth/AuthMote' // 模特专业认证
import AuthResult from './components/auth/AuthResult' // 结果

import Content from './components/root/Content'
import AlbumInfo from './components/album/AlbumInfo'

var routes = (
	<Router>
    {/* ****************已登录的内容**************** */}
		<Route path="/" component={Content} comment="已登录内容容器">
      {/* ****************首页信息**************** */}
      <IndexRedirect to="main" />
      <Route path="main" component={AlbumInfo} comment="首页，作品信息" />
      {/* ****************账户信息**************** */}
			<Route path="/account" component={AccountCenter} comment="账户信息">
				<IndexRedirect to="personInfo" />
				<Route path="personInfo" component={PersonInfo} />
				<Route path="info" component={AccountInfo} />
				<Route path="upload" component={UploadWorks} />
			</Route>
      {/* ****************订单信息**************** */}
			<Route path="order/:type/:state" component={OrderManager} />
      {/* ****************作品信息**************** */}
			<Route path="albums/:id" component={Albums} />
      {/* ****************认证信息**************** */}
      <Route path="auth" component={AuthContainer} comment="认证信息">
        <IndexRoute component={AuthSummary} comment="认证总览" />
        <Route path="basic" component={AuthBasic} comment="认证基本信息" />
        <Route path="real" component={AuthRealName} comment="实名认证" />
        <Route path="p" component={AuthPhotographer} comment="摄影师认证" />
        <Route path="a" component={AuthMakeupArtist} comment="化妆师认证" />
        <Route path="m" component={AuthMote} comment="模特认证" />
        <Route path="result" component={AuthResult} comment="能用认证结果页" />
      </Route>
		</Route>
    {/* ****************未登录的内容**************** */}
    <Route path="/login" component={Home} comment="登录注册" />
    <Route path="/provision" component={Provision} comment="条款" />
    <Route path="/404" component={NF404} comment="传说中的404" />
    <Redirect from="*" to="/404" comment="我有次把它放在了/404前" />
	</Router>
);

exports.start = function() {
		React.render(routes, document.getElementById('content'));
}
