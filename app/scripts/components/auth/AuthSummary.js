import React from 'react'
import { History } from 'react-router'
var InfoHeader = require('../infoHeader')

import {
  ROUTE_AUTH_SUMMARY,
  ROUTE_AUTH_BASIC,
  ROUTE_AUTH_REALNAME,
  ROUTE_AUTH_PHOTOGRAPHER,
  ROUTE_AUTH_MAKEUPARTIST,
  ROUTE_AUTH_MOTE,
  ROUTE_AUTH_RESULT,
}
from '../../routeConfig'

const convertLinkToVal = function(basic, real, type) {
  let secondTarget = type === 'p' ? ROUTE_AUTH_PHOTOGRAPHER :
    type === 'a' ? ROUTE_AUTH_MAKEUPARTIST :
    type === 'm' ? ROUTE_AUTH_MOTE :
    ROUTE_AUTH_SUMMARY
  let firstTarget  = !basic ? ROUTE_AUTH_BASIC :
    !real ? ROUTE_AUTH_REALNAME : ''
  return {
    first: firstTarget,
    second: secondTarget,
  }
}

const isDenied = function(status) {
  return status === '审核拒绝'
}

const statusToHint = function(status) {
var hint = ' '
  if(status === '未申请') {
    hint = '立即申请'
  } else if(status === '审核拒绝') {
    hint = '重新申请'
  }
  return hint
}

var AuthSummary = React.createClass({
  mixins: [History],
  render: function() {
    const {
      realNameComplete,
      photographerAuthed,
      makeupArtistAuthed,
      moteAuthed,
     } = this.props
    return (
      <div>
        <InfoHeader
          infoTitle="入驻邀拍"
          rightInfo={'实名：' + this.props.realName.status}
          infoIconClass="glyphicon glyphicon-camera"
        />
        <div className="row">
          <div className="col-sm-4 col-xs-12">
            <div className="panel panel-default">
              <div className="panel-body text-center">
                <div style={{ minHeight: 350 }}>
                  <div style={{ padding: 15 }}>
                    <div style={{
                        height: 150,
                        width: 150,
                        borderRadius: '50%',
                        background: '#D1D1D1',
                        margin: '0 auto 10px',
                      }}></div>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <strong>摄影师认证：</strong>
                    <span className="label label-info">{ this.props.authPhotographer.status }</span>
                  </div>
                  <div style={{
                      color: '#B2B2B2',
                      lineHeight: '30px',
                      padding: '15px 0',
                    }}>
                    YAOPAI 资源供您免费使用<br />
                    需求精准推送，减少沟通成本<br />
                    全方位推广分分钟挤爆订单
                  </div>
                  {
                    isDenied(this.props.authPhotographer.status) && this.props.authPhotographer.reason ?
                    <div>原因：{ this.props.authPhotographer.reason }</div> : ''
                  }
                </div>
                {photographerAuthed ?
                  <button className="btn btn-block btn-default" disabled="true">
                    { this.props.authPhotographer.status }
                  </button> :
                  <a className="btn btn-block btn-default" onClick={ () => this.onClickAuthTarget('p') }>
                    { statusToHint(this.props.authPhotographer.status) }
                  </a>
                }
              </div>
            </div>
          </div>
          <div className="col-sm-4 col-xs-12">
            <div className="panel panel-default">
              <div className="panel-body text-center">
                <div style={{ minHeight: 350 }}>
                  <div style={{ padding: 15 }}>
                    <div style={{
                        height: 150,
                        width: 150,
                        borderRadius: '50%',
                        background: '#C3DBEA',
                        margin: '0 auto 10px',
                      }}></div>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <strong>化妆师认证：</strong>
                    <span className="label label-info">{ this.props.authMakeupArtist.status }</span>
                  </div>
                  <div style={{
                      color: '#B2B2B2',
                      lineHeight: '30px',
                      padding: '15px 0',
                    }}>
                    专业、全面的个人作品展示<br />
                    提供全方位的包装推广服务<br />
                    有新的订单会立即推送给你
                  </div>
                  {
                    isDenied(this.props.authMakeupArtist.status) && this.props.authMakeupArtist.reason ?
                    <div>原因：{this.props.authMakeupArtist.reason}</div> : ''
                  }
                </div>
                {
                  makeupArtistAuthed ?
                  <button className="btn btn-block btn-default" disabled="true">
                    { this.props.authMakeupArtist.status }
                  </button> :
                  <a className="btn btn-block btn-default" onClick={ () => this.onClickAuthTarget('a') }>
                    { statusToHint(this.props.authMakeupArtist.status) }
                  </a>
                }
              </div>
            </div>
          </div>
          <div className="col-sm-4 col-xs-12">
            <div className="panel panel-default">
              <div className="panel-body text-center">
                <div style={{ minHeight: 350 }}>
                  <div style={{ padding: 15 }}>
                    <div style={{
                        height: 150,
                        width: 150,
                        borderRadius: '50%',
                        background: '#EA9A9E',
                        margin: '0 auto 10px',
                      }}></div>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <strong>模特认证：</strong>
                    <span className="label label-info">{ this.props.authMote.status }</span>
                  </div>
                  <div style={{
                      color: '#B2B2B2',
                      lineHeight: '30px',
                      padding: '15px 0',
                    }}>
                    专业、全面的个人形象展示<br />
                    提供全方位的包装推广服务<br />
                    打造属于您的个人品牌
                  </div>
                  {
                    isDenied(this.props.authMote.status) && this.props.authMote.reason ?
                    <div>原因：{this.props.authMote.reason}</div> : ''
                  }
                </div>
                {
                  moteAuthed ?
                  <button className="btn btn-block btn-default" disabled="true">
                    { this.props.authMote.status }
                  </button> :
                  <a className="btn btn-block btn-default" onClick={ () => this.onClickAuthTarget('m') }>
                    { statusToHint(this.props.authMote.status) }
                  </a>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  onClickAuthTarget: function(magic) {
    const {
      userComplete,
      realNameComplete,
    } = this.props
    var targets = convertLinkToVal(userComplete, realNameComplete, magic)
    if(targets.first) {
      this.props.history.pushState(null, targets.first)
    } else {
      this.props.history.pushState(null, targets.second)
    }
    this.props.changeAuthTarget(targets.second)
  },
})

export default AuthSummary
