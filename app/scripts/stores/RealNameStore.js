var Reflux = require('reflux');
var AccountActions = require('../actions/AccountActions');
var AuthAction = require('../actions/AuthAction');

const REALNAME_DEFAULT = '未获取';
const REALNAME_NONE = '未申请';
const REALNAME_PENDING = '审核中';
const REALNAME_APPROVE = '审核通过';
const REALNAME_DISAPPROVE = '审核拒绝';

const convertRealNameStatus = function(serverStatus) {
  return serverStatus === 'None' ? REALNAME_NONE :
    serverStatus === 'Pending' ? REALNAME_PENDING :
    serverStatus === 'Approve' ? REALNAME_APPROVE :
    serverStatus === 'Unapprove' ? REALNAME_DISAPPROVE :
    REALNAME_NONE;
};
/**
 * 实名认证信息
 */
const RealNameStore = Reflux.createStore({
  getInitialState: function() {
    return {
      /* 认证状态 */
      status: REALNAME_DEFAULT,
      /* 审核原因 */
      reason: '',
      /* 实名姓名 */
      name: '',
      /* 实名证件号 */
      idNumber: '',
      /* 实名证件图片 */
      idNumberImages: [],
    };
  },
  init: function() {
    this.listenTo(AccountActions.userDetail.success, this.onUserDetail);
    this.listenTo(AuthAction.changeRealName.success, this.onChangeRealName);
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
      self.status = convertRealNameStatus(resp.RealNameState);
      self.reason = resp.RealNameFailedReason;
      // TODO: 以下内容可能不要存
      self.name = resp.RealName;
      self.idNumber = resp.IdNumber;
      self.idNumberImages = resp.IdNumberImages;
      self.trigger(this);
    }
  },
  onChangeRealName: function() {

  },
});

module.exports = {
  REALNAME_DEFAULT,
  REALNAME_NONE,
  REALNAME_PENDING,
  REALNAME_APPROVE,
  REALNAME_DISAPPROVE,
  RealNameStore,
};
