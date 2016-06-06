var Reflux = require('reflux');
var AuthAction = require('../../actions/AuthAction');

const MAKEUPARTIST_AUTH_DEFAULT = '未获取';
const MAKEUPARTIST_AUTH_NONE = '未申请';
const MAKEUPARTIST_AUTH_PENDING = '审核中';
const MAKEUPARTIST_AUTH_APPROVE = '审核通过';
const MAKEUPARTIST_AUTH_DISAPPROVE = '审核拒绝';

const convertRealNameStatus = function(serverStatus) {
  return serverStatus === 'None' ? MAKEUPARTIST_AUTH_NONE :
    serverStatus === 'Pending' ? MAKEUPARTIST_AUTH_PENDING :
    serverStatus === 'Approve' ? MAKEUPARTIST_AUTH_APPROVE :
    serverStatus === 'Unapprove' ? MAKEUPARTIST_AUTH_DISAPPROVE :
    MAKEUPARTIST_AUTH_NONE;
};

const MakeupArtistAuthStore = Reflux.createStore({
  getInitialState: function() {
    /*
     * 摄影师：photographer
     */
    return {
      /* 认证状态 */
      status: MAKEUPARTIST_AUTH_DEFAULT,
      /* 认证（失败）原因 */
      reason: '',
      /* 审核时间 */
      time: '',
      /* 认证作品列表 */
      workList: [],
    };
  },
  init: function() {
    this.listenTo(AuthAction.viewMakeupArtistAudit.success, this.onViewMakeupArtistAudit);
    this.listenTo(AuthAction.submitMakeupArtistAudit.success, this.onSubmitMakeupArtistAudit);
  },
  onViewMakeupArtistAudit: function(resp) {
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
      self.status = MAKEUPARTIST_AUTH_NONE;
      self.reason = '';
      self.time = '';
      self.workList = [];
      self.trigger(this);
    }
  },
  onSubmitMakeupArtistAudit: function() {

  },
});

module.exports = {
  MAKEUPARTIST_AUTH_DEFAULT,
  MAKEUPARTIST_AUTH_NONE,
  MAKEUPARTIST_AUTH_PENDING,
  MAKEUPARTIST_AUTH_APPROVE,
  MAKEUPARTIST_AUTH_DISAPPROVE,
  MakeupArtistAuthStore,
};
