import 'css/main.css'
import 'css/mainAgain.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, IndexRedirect } from 'react-router'

import Test from 'photographer/Test'

/* ********************************首页******************************** */
import Content from 'components/root/Content'
/* ********************************账户******************************** */
import AccountContainer from 'components/account/AccountContainer'
import BasicInfo from 'components/account/info/BasicInfo'
import DetailInfo from 'components/account/info/DetailInfo'
// 404
import NF404 from 'components/root/404'
// import MoteInfo from './mote/MoteInfo'
// import UserInfoPanel from './user/UserInfoPanel'
/* ********************************认证******************************** */
import AuthContainer from 'components/auth/AuthContainer' // 认证容器
import AuthSummary from 'components/auth/AuthSummary' // 总览
import AuthBasic from 'components/auth/AuthBasic' // 基本信息
import AuthRealName from 'components/auth/AuthRealName' // 实名认证
import AuthPhotographer from 'components/auth/AuthPhotographer' // 摄影师专业认证
import AuthMakeupArtist from 'components/auth/AuthMakeupArtist' // 化妆师专业认证
import AuthMote from 'components/auth/AuthMote' // 模特专业认证
import AuthResult from 'components/auth/AuthResult' // 结果
/* ********************************作品上传******************************** */
import AlbumInfo from 'components/album/AlbumInfo'
import MakeupArtistUploadRouteComponent from 'routes/upload/makeupartist'
import MoteUploadRouteComponent from 'routes/upload/mote'

const Home = require('components/home')
const PersonInfo = require('components/personInfo')
const AccountInfo = require('components/accountInfo')
const AlbumSummary = require('components/AlbumSummary')
const UploadPhotographer = require('components/uploadPhotographer')
// const UploadMote = require('components/uploadMote')
// const OrderManager = require('components/orderManager')
// const UploadDresser = require('components/uploadDresser')
// const OrderManager = require('components/orderManager')
const Albums = require('components/albums/index')
const Provision = require('components/provision')

require('./vendor/qiniu')

const routes = (
  <Router>
    <Route path="/test" component={Test} comment="test only" />
    {/* ****************已登录的内容**************** */}
    <Route path="/" component={Content} comment="已登录内容容器">
      {/* ****************首页信息**************** */}
      <IndexRedirect to="main" />
      <Route path="main" component={AlbumInfo} comment="首页，作品信息" />
      {/* ****************账户信息**************** */}
      <Route path="/account" component={AccountContainer} comment="账户信息">
        <IndexRedirect to="info" />
        <Route path="info" component={PersonInfo} />
        <Route path="basic" component={BasicInfo} />
        <Route path="detail" component={DetailInfo} />
        {/* <Route path="m" component={ MoteInfo } /> */}
        <Route path="password" component={AccountInfo} />
      </Route>
      {/* ****************TODO: 订单信息**************** */}
      {/* <Route path="order/:type/:state" component={ OrderManager } /> */}
      {/* ****************作品上传**************** */}
      <Route path="upload">
        <IndexRoute component={AlbumSummary} comment="上传总览" />
        <Route path="photographer" component={UploadPhotographer} comment="摄影师作品上传" />
        <Route path="mote" component={MoteUploadRouteComponent} comment="模特作品上传" />
        <Route path="makeupartist" component={MakeupArtistUploadRouteComponent} comment="化妆师作品上传" />
      </Route>
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
    {/* TODO: 把这货放[/album]里去 */}
    <Route path="albums/:id" component={Albums} />
    {/* ****************未登录的内容**************** */}
    <Route path="/login" component={Home} comment="登录注册" />
    <Route path="/provision" component={Provision} comment="条款" />
    <Route path="*" component={NF404} comment="传说中的404" />
  </Router>
)


ReactDOM.render(routes, document.getElementById('content'))
