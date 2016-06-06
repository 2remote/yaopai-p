var Reflux = require('reflux');
var AuthAction = require('../../actions/AuthAction');

const PHOTOGRAPHER_AUTH_DEFAULT = '未获取';
const PHOTOGRAPHER_AUTH_NONE = '未申请';
const PHOTOGRAPHER_AUTH_PENDING = '审核中';
const PHOTOGRAPHER_AUTH_APPROVE = '审核通过';
const PHOTOGRAPHER_AUTH_DISAPPROVE = '审核拒绝';

const convertRealNameStatus = function(serverStatus) {
  return serverStatus === 'None' ? PHOTOGRAPHER_AUTH_NONE :
    serverStatus === 'Pending' ? PHOTOGRAPHER_AUTH_PENDING :
    serverStatus === 'Approve' ? PHOTOGRAPHER_AUTH_APPROVE :
    serverStatus === 'Unapprove' ? PHOTOGRAPHER_AUTH_DISAPPROVE :
    PHOTOGRAPHER_AUTH_NONE;
};

const PhotographerAuthStore = Reflux.createStore({
  getInitialState: function() {
    /*
     * 摄影师：photographer
     */
    return {
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
  init: function() {
    this.listenTo(AuthAction.viewPhotographerAudit.success, this.onViewPhotographerAudit);
    this.listenTo(AuthAction.submitPhotographerAudit.success, this.onSubmitPhotographerAudit);
  },
  onViewPhotographerAudit: function(resp) {
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
      self.status = PHOTOGRAPHER_AUTH_NONE;
      self.reason = '';
      self.time = '';
      self.workList = [];
      self.trigger(this);
    }
  },
  onSubmitPhotographerAudit: function() {

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
