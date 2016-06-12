var Reflux = require('reflux');
var AuthAction = require('../../actions/AuthAction');

const MOTE_AUTH_DEFAULT = '未获取';
const MOTE_AUTH_NONE = '未申请';
const MOTE_AUTH_PENDING = '审核中';
const MOTE_AUTH_APPROVE = '审核通过';
const MOTE_AUTH_DISAPPROVE = '审核拒绝';

const convertRealNameStatus = function(serverStatus) {
  return serverStatus === 'None' ? MOTE_AUTH_NONE :
    serverStatus === 'Pending' || serverStatus === 0 ? MOTE_AUTH_PENDING :
    serverStatus === 'Approve' || serverStatus === 1 ? MOTE_AUTH_APPROVE :
    serverStatus === 'Unapprove' || serverStatus === 2 ? MOTE_AUTH_DISAPPROVE :
    MOTE_AUTH_NONE;
};

const MoteAuthStore = Reflux.createStore({
  getInitialState: function() {
    /*
     * 摄影师：photographer
     */
    return this.data;
  },
  init: function() {
    this.listenTo(AuthAction.viewMoteAudit.success, this.onViewMoteAudit);
    this.listenTo(AuthAction.submitMoteAudit.success, this.onSubmitMoteAudit);
    this.data = {
      /* 认证状态 */
      status: MOTE_AUTH_DEFAULT,
      /* 认证（失败）原因 */
      reason: '',
      /* 审核时间 */
      time: '',
      /* 认证作品列表 */
      workList: [],
    };
  },
  onViewMoteAudit: function(resp) {
    const self = this;
    let data = self.data;
    if(resp.Success) {
      data.status = convertRealNameStatus(resp.State);
      data.reason = resp.Reason;
      data.time = resp.AuditTime;
      data.workList = resp.Works;
      self.trigger(data);
    } else {
      // TODO: 传入ErrorCode和ErrorMsg
      // this.onError({});
      data.status = MOTE_AUTH_NONE;
      data.reason = '';
      data.time = '';
      data.workList = [];
      self.trigger(data);
    }
  },
  onSubmitMoteAudit: function(resp) {
    const self = this;
    let data = self.data;
    if(resp.Success) {
      data.status = MOTE_AUTH_PENDING;
    }
  },
});

module.exports = {
  MOTE_AUTH_DEFAULT,
  MOTE_AUTH_NONE,
  MOTE_AUTH_PENDING,
  MOTE_AUTH_APPROVE,
  MOTE_AUTH_DISAPPROVE,
  MoteAuthStore,
};
