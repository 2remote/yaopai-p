var Reflux = require('reflux');
var AuthAction = require('../actions/AuthAction');
var AccountActions = require('../actions/AccountActions');

const REALNAME_NONE = 'realname_none';
const REALNAME_PENDING = 'realname_pending';
const REALNAME_APPROVE = 'realname_approve';
const REALNAME_UNAPPROVE = 'realname_unapprove';

const AUTH_PHOTOGRAPHER = 'auth_photographer';
const AUTH_MAKEUPARTIST = 'auth_makeupArtist';
const AUTH_MOTE = 'auth_mote';


const convertRealNameStatus = function(serverStatus) {
  return serverStatus === 'None' ? REALNAME_NONE :
    serverStatus === 'Pending' ? REALNAME_PENDING :
    serverStatus === 'Approve' ? REALNAME_APPROVE :
    serverStatus === 'Unapprove' ? REALNAME_UNAPPROVE :
    REALNAME_NONE;
};
/*
 * AuthStore用于存储与认证有关的信息
 * **前置**
 * 实名：realName
 * **专业**
 * 摄影师：photographer
 * 化妆师：makeupArtist
 * 模特：mote
 */
var AuthStore = Reflux.createStore({
  /*
   * 实名：realName
   */
  realName: {
    /* 认证状态 */
    status: '',
    reason: '',
    name: '',
    idNumber: '',
    idNumberImages: '',
  },
  /*
   * 摄影师：photographer
   */
  photographer: {
    type: AUTH_PHOTOGRAPHER,
    /* 认证状态 */
    auditStatus: '',
    /* 认证（失败）原因 */
    reason: '',
    /* 审核时间 */
    auditTime: '',
    /* 认证作品列表 */
    auditWorkList: [],
  },
  /*
   * 化妆师：makeupArtist
   */
  makeupArtist: {
    type: AUTH_MAKEUPARTIST,
    /* 认证状态 */
    auditStatus: '',
    /* 认证（失败）原因 */
    reason: '',
    /* 审核时间 */
    auditTime: '',
    /* 认证作品列表 */
    auditWorkList: [],
  },
  /*
   * 模特：mote
   */
  mote: {
    type: AUTH_MOTE,
    /* 认证状态 */
    auditStatus: '',
    /* 认证（失败）原因 */
    reason: '',
    /* 审核时间 */
    auditTime: '',
    /* 认证作品列表 */
    auditWorkList: [],
  },
  init: function() {
    this.listenTo(AccountActions.userDetail.success, this.onUserDetail);
    this.listenTo(AuthAction.changeRealName.success, this.onChangeRealName);
    this.listenTo(AuthAction.viewPhotographerAudit.success, this.onViewPhotographerAudit);
    this.listenTo(AuthAction.submitPhotographerAudit.success, this.onSubmitPhotographerAudit);
    this.listenTo(AuthAction.viewMakeupArtistAudit.success, this.onViewMakeupArtistAudit);
    this.listenTo(AuthAction.submitMakeupArtistAudit.success, this.onSubmitMakeupArtistAudit);
    this.listenTo(AuthAction.viewMoteAudit.success, this.onViewMoteAudit);
    this.listenTo(AuthAction.submitMoteAudit.success, this.onSubmitMoteAudit);
    this.listenTo(AuthAction.submitMoteAudit.error, this.onError);
  },
  onUserDetail: function(resp) {
    const self = this;
    if(resp.Success) {
      /*
       * 后台返回实名认证状态：
       * None：无
       * Pending：待审核
       * Approve：通过
       * Unapprove：不通过
       */
      self.realName.status = convertRealNameStatus(resp.RealNameState);
      self.realName.reason = resp.RealNameFailedReason;
      // TODO: 以下内容可能不要存
      self.realName.name = resp.RealName;
      self.realName.idNumber = resp.IdNumber;
      self.realName.idNumberImages = resp.IdNumberImages;
    }
  },
  onChangeRealName: function(resp) {
    var self = this;
    if(resp.Success) {
      self.realName = { // 是的，我要把其他的数据清理掉
        status: REALNAME_PENDING,
      };
    }
  },
  onViewPhotographerAudit: function(resp) {
    const self = this;
    if(resp.Success) {
      self.photographer.auditStatus = resp.State;
      self.photographer.reason = resp.Reason;
      self.photographer.auditTime = resp.AuditTime;
      self.photographer.auditWorkList = resp.Works;
      self.trigger(self.photographer);
    } else {
      // TODO: 传入ErrorCode和ErrorMsg
      // this.onError({});
    }
  },
  onSubmitPhotographerAudit: function(resp, data) {
    const self = this;
    if(resp.Success) {
      self.photographer.auditWorkList = data.Works;
      // TODO: Maybe I should trigger a success flag?
      self.trigger(self.photographer);
    }
  },
  onViewMakeupArtistAudit: function(resp) {
    const self = this;
    if(resp.Success) {
      self.makeupArtist.auditStatus = resp.State;
      self.makeupArtist.reason = resp.Reason;
      self.makeupArtist.auditTime = resp.AuditTime;
      self.makeupArtist.auditWorkList = resp.Works;
      self.trigger(self.makeupArtist);
    } else {
      // TODO: 传入ErrorCode和ErrorMsg
      // this.onError({});
    }
  },
  onSubmitMakeupArtistAudit: function(resp, data) {
    const self = this;
    if(resp.Success) {
      self.makeupArtist.auditWorkList = data.Works;
      self.trigger(self.makeupArtist);
    } else {
      // TODO: 传入ErrorCode和ErrorMsg
      // this.onError({});
    }
  },
  onViewMoteAudit: function(resp) {
    const self = this;
    if(resp.Success) {
      self.mote.auditStatus = resp.State;
      self.mote.reason = resp.Reason;
      self.mote.auditTime = resp.AuditTime;
      self.mote.auditWorkList = resp.Works;
      self.trigger(self.mote);
    } else {
      // TODO: 传入ErrorCode和ErrorMsg
      // this.onError({});
    }
  },
  onSubmitMoteAudit: function(resp, data) {
    const self = this;
    if(resp.Success) {
      self.mote.auditWorkList = data.Works;
      self.trigger(self.mote);
    } else {
      // TODO: 传入ErrorCode和ErrorMsg
      // this.onError({});
    }
  },
  onError: function(error) {

  },
});

module.exports = {
  REALNAME_STATUS: {
    REALNAME_NONE,
    REALNAME_PENDING,
    REALNAME_APPROVE,
    REALNAME_UNAPPROVE,
  },
  AUTH: {
    AUTH_PHOTOGRAPHER,
    AUTH_MAKEUPARTIST,
    AUTH_MOTE,
  },
  AuthStore,
};
