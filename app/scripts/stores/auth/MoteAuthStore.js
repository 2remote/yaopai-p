var Reflux = require('reflux');
var AuthAction = require('../../actions/AuthAction');

const MOTE_AUTH_DEFAULT = '未获取';
const MOTE_AUTH_NONE = '未申请';
const MOTE_AUTH_PENDING = '审核中';
const MOTE_AUTH_APPROVE = '审核通过';
const MOTE_AUTH_DISAPPROVE = '审核拒绝';

const convertRealNameStatus = function(serverStatus) {
  return serverStatus === 'None' ? MOTE_AUTH_NONE :
    serverStatus === 'Pending' ? MOTE_AUTH_PENDING :
    serverStatus === 'Approve' ? MOTE_AUTH_APPROVE :
    serverStatus === 'Unapprove' ? MOTE_AUTH_DISAPPROVE :
    MOTE_AUTH_NONE;
};

const MoteAuthStore = Reflux.createStore({
  getInitialState: function() {
    /*
     * 摄影师：photographer
     */
    return {
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
  init: function() {
    this.listenTo(AuthAction.viewMoteAudit.success, this.onViewMoteAudit);
    this.listenTo(AuthAction.submitMoteAudit.success, this.onSubmitMoteAudit);
  },
  onViewMoteAudit: function(resp) {
    const self = this;
    if(resp.Success) {
      self.status = convertRealNameStatus(resp.State);
      self.reason = resp.Reason;
      self.time = resp.AuditTime;
      self.workList = resp.Works;
      self.trigger(this);
    } else {
      // TODO: 传入ErrorCode和ErrorMsg
      // this.onError({});
      self.status = MOTE_AUTH_NONE;
      self.reason = '';
      self.time = '';
      self.workList = [];
      self.trigger(this);
    }
  },
  onSubmitMoteAudit: function() {

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
