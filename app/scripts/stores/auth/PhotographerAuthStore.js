var Reflux = require('reflux');
var AuthAction = require('../../actions/AuthAction');

const PHOTOGRAPHER_AUTH_DEFAULT = '未获取';
const PHOTOGRAPHER_AUTH_NONE = '未申请';
const PHOTOGRAPHER_AUTH_PENDING = '审核中';
const PHOTOGRAPHER_AUTH_APPROVE = '审核通过';
const PHOTOGRAPHER_AUTH_DISAPPROVE = '审核拒绝';

const convertRealNameStatus = function(serverStatus) {
  return serverStatus === 'None' ? PHOTOGRAPHER_AUTH_NONE :
    serverStatus === 'Pending' || serverStatus === 0 ? PHOTOGRAPHER_AUTH_PENDING :
    serverStatus === 'Approve' || serverStatus === 1 ? PHOTOGRAPHER_AUTH_APPROVE :
    serverStatus === 'Unapprove' || serverStatus === 2 ? PHOTOGRAPHER_AUTH_DISAPPROVE :
    PHOTOGRAPHER_AUTH_NONE;
};

const PhotographerAuthStore = Reflux.createStore({
  getInitialState: function() {
    /*
     * 摄影师：photographer
     */
    return this.data;
  },
  init: function() {
    this.listenTo(AuthAction.viewPhotographerAudit.success, this.onViewPhotographerAudit);
    this.listenTo(AuthAction.submitPhotographerAudit.success, this.onSubmitPhotographerAudit);
    this.data = {
      /* 认证状态 */
      status: PHOTOGRAPHER_AUTH_DEFAULT,
      /* 认证（失败）原因 */
      reason: '',
      /* 审核时间 */
      time: '',
      /* 认证作品列表 */
      workList: [],
    };
  },
  onViewPhotographerAudit: function(resp) {
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
      data.status = PHOTOGRAPHER_AUTH_NONE;
      data.reason = '';
      data.time = '';
      data.workList = [];
      self.trigger(data);
    }
  },
  onSubmitPhotographerAudit: function(resp) {
    const self = this;
    let data = self.data;
    if(resp.Success) {
      data.status = PHOTOGRAPHER_AUTH_PENDING;
    }
  },
});

module.exports = {
  PHOTOGRAPHER_AUTH_DEFAULT,
  PHOTOGRAPHER_AUTH_NONE,
  PHOTOGRAPHER_AUTH_PENDING,
  PHOTOGRAPHER_AUTH_APPROVE,
  PHOTOGRAPHER_AUTH_DISAPPROVE,
  PhotographerAuthStore,
};
