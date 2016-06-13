var Reflux = require('reflux');
var AccountActions = require('../actions/AccountActions');
var AuthAction = require('../actions/AuthAction');

const CHANGE_AVATAR = 'change_avatar';
const UPDATE_INFO = 'update_info';
const CHANGE_REALNAME = 'change_realName';

const AUTH_PHOTOGRAPHER_SUBMIT_AUDIT = 'auth_photographer_submit_audit';
const AUTH_MAKEUPARTIST_SUBMIT_AUDIT = 'auth_makeupArtist_submit_audit';
const AUTH_MOTE_SUBMIT_AUDIT = 'auth_mote_submit_audit';

var NotifyStore = Reflux.createStore({
  init: function() {
    this.listenTo(AccountActions.changeAvatar.success, this.triggerWrapper(CHANGE_AVATAR, true));
    this.listenTo(AccountActions.changeAvatar.failed, this.triggerWrapper(CHANGE_AVATAR, false));
    this.listenTo(AccountActions.updateInfo.success, this.triggerWrapper(UPDATE_INFO, true));
    this.listenTo(AccountActions.updateInfo.failed, this.triggerWrapper(UPDATE_INFO, false));
    this.listenTo(AccountActions.changeRealName.success, this.triggerWrapper(CHANGE_REALNAME, true));
    this.listenTo(AccountActions.changeRealName.failed, this.triggerWrapper(CHANGE_REALNAME, false));
    this.listenTo(AuthAction.submitPhotographerAudit.success, this.triggerWrapper(AUTH_PHOTOGRAPHER_SUBMIT_AUDIT, true));
    this.listenTo(AuthAction.submitPhotographerAudit.error, this.triggerWrapper(AUTH_PHOTOGRAPHER_SUBMIT_AUDIT, false));
    this.listenTo(AuthAction.submitMakeupArtistAudit.success, this.triggerWrapper(AUTH_MAKEUPARTIST_SUBMIT_AUDIT, true));
    this.listenTo(AuthAction.submitMakeupArtistAudit.error, this.triggerWrapper(AUTH_MAKEUPARTIST_SUBMIT_AUDIT, false));
    this.listenTo(AuthAction.submitMoteAudit.success, this.triggerWrapper(AUTH_MOTE_SUBMIT_AUDIT, true));
    this.listenTo(AuthAction.submitMoteAudit.error, this.triggerWrapper(AUTH_MOTE_SUBMIT_AUDIT, false));
  },
  triggerWrapper: function(source, success) {
    return function(resp) {
      this.trigger({
        source: source,
        success: success && resp.Success,
        msg: resp.ErrorMsg, // TODO: 这里要“或”一个非200的http response
      });
    };
  },
});

module.exports = {
  /* 更改头像 */
  CHANGE_AVATAR,
  /* 更新信息 */
  UPDATE_INFO,
  /* 实名认证 */
  CHANGE_REALNAME,
  /* 摄影师认证-提交认证作品 */
  AUTH_PHOTOGRAPHER_SUBMIT_AUDIT,
  /* 化妆师认证-提交认证作品 */
  AUTH_MAKEUPARTIST_SUBMIT_AUDIT,
  /* 模特认证-提交认证作品 */
  AUTH_MOTE_SUBMIT_AUDIT,
  /* The Store! */
  NotifyStore,
};
