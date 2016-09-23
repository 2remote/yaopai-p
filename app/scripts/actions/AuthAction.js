var Reflux = require('reflux');
var { post } = require('util/HttpFactory');
var API = require('util/api');
var { attachData } = require('../tools');

/*
 * 认证action，包括：
 *   - 实名认证
 *   - 摄影师登认证
 *   - 化妆师认证
 *   - 模特认证
 */
var AuthAction = Reflux.createActions({
  'changeRealName': {children: ['success', 'error']}, // 实名认证提交
  /* ***************** 摄影师 ***************** */
  'viewPhotographerAudit': {children: ['success', 'error']}, // 获取摄影师认证信息
  'submitPhotographerAudit': {children: ['success', 'error']}, // 摄影师认证提交
  /* ***************** 化妆师 ***************** */
  'viewMakeupArtistAudit': {children: ['success', 'error']}, // 获取化妆师认证信息
  'submitMakeupArtistAudit': {children: ['success', 'error']}, // 化妆师认证提交
  /* ***************** 模特 ***************** */
  'viewMoteAudit': {children: ['success', 'error']}, // 获取模特认证信息
  'submitMoteAudit': {children: ['success', 'error']}, // 模特认证提交
});


/*
 * 本方法用于提交实名认证信息
 *
 * @param data: 结构参考后台接口
 */
AuthAction.changeRealName.listen(function(data) {
  const self = this;
  post(API.USER.changeRealName, data, attachData(self.success, data), self.error);
});

/* ***************** 摄影师 ***************** */

/*
 * 本方法用于获取摄影师认证信息
 *
 * @param data: 结构参考后台接口
 */
AuthAction.viewPhotographerAudit.listen(function() {
  const data = {
    Fields: 'Id,Works,State,Reason,AuditTime,CreationTime',
  };
  const self = this;
  post(API.PHOTOGRAPHER.viewAudit, data, self.success, self.error);
});

/*
 * 本方法用于提交摄影师认证信息
 *
 * @param data: 结构参考后台接口
 */
AuthAction.submitPhotographerAudit.listen(function(data) {
  const self = this;
  post(API.PHOTOGRAPHER.submitAudit, data, attachData(self.success, data), self.error);
});

/* ***************** 化妆师 ***************** */

/*
 * 本方法用于获取化妆师认证信息
 *
 * @param data: 结构参考后台接口
 */
AuthAction.viewMakeupArtistAudit.listen(function() {
  const data = {
    Fields: 'Id,Works,State,Reason,AuditTime,CreationTime',
  };
  const self = this;
  post(API.MAKEUPARTIST.viewAudit, data, self.success, self.error);
});

/*
 * 本方法用于提交化妆师认证信息
 *
 * @param data: 结构参考后台接口
 */
AuthAction.submitMakeupArtistAudit.listen(function(data) {
  const self = this;
  post(API.MAKEUPARTIST.submitAudit, data, attachData(self.success, data), self.error);
});

/* ***************** 模特 ***************** */

/*
 * 本方法用于获取模特认证信息
 *
 * @param data: 结构参考后台接口
 */
AuthAction.viewMoteAudit.listen(function() {
  const data = {
    Fields: 'Id,Works,State,Reason,AuditTime,CreationTime',
  };
  const self = this;
  post(API.MOTE.viewAudit, data, self.success, self.error);
});

/*
 * 本方法用于提交模特认证信息
 *
 * @param data: 结构参考后台接口
 */
AuthAction.submitMoteAudit.listen(function(data) {
  const self = this;
  post(API.MOTE.submitAudit, data, attachData(self.success, data), self.error);
});

module.exports = AuthAction;
