var Reflux = require('reflux');
var AuthAction = require('../../actions/AuthAction');

const MAKEUPARTIST_AUTH_DEFAULT = '未获取';
const MAKEUPARTIST_AUTH_NONE = '未申请';
const MAKEUPARTIST_AUTH_PENDING = '审核中';
const MAKEUPARTIST_AUTH_APPROVE = '审核通过';
const MAKEUPARTIST_AUTH_DISAPPROVE = '审核拒绝';

const convertRealNameStatus = function(serverStatus) {
  return serverStatus === 'None' ? MAKEUPARTIST_AUTH_NONE :
    serverStatus === 'Pending' || serverStatus === 0 ? MAKEUPARTIST_AUTH_PENDING :
    serverStatus === 'Approve' || serverStatus === 1 ? MAKEUPARTIST_AUTH_APPROVE :
    serverStatus === 'Unapprove' || serverStatus === 2 ? MAKEUPARTIST_AUTH_DISAPPROVE :
    MAKEUPARTIST_AUTH_NONE;
};

const MakeupArtistAuthStore = Reflux.createStore({
  getInitialState: function() {
    /*
     * 摄影师：photographer
     */
    return this.data;
  },
  init: function() {
    this.listenTo(AuthAction.viewMakeupArtistAudit.success, this.onViewMakeupArtistAudit);
    this.listenTo(AuthAction.submitMakeupArtistAudit.success, this.onSubmitMakeupArtistAudit);
    this.data = {
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
  onViewMakeupArtistAudit: function(resp) {
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
      data.status = MAKEUPARTIST_AUTH_NONE;
      data.reason = '';
      data.time = '';
      data.workList = [];
      self.trigger(data);
    }
  },
  onSubmitMakeupArtistAudit: function(resp) {
    const self = this;
    let data = self.data;
    if(resp.Success) {
      data.status = MAKEUPARTIST_AUTH_PENDING;
    }
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
