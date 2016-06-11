var Reflux = require('reflux');
var AccountActions = require('../actions/AccountActions');

const CHANGE_AVATAR = 'change_avatar';
const CHANGE_REALNAME = 'change_realName';
const UPDATE_INFO = 'update_info';

var NotifyStore = Reflux.createStore({
  init: function() {
    this.listenTo(AccountActions.changeAvatar.success, this.triggerWrapper(CHANGE_AVATAR, true));
    this.listenTo(AccountActions.changeAvatar.failed, this.triggerWrapper(CHANGE_AVATAR, false));
    this.listenTo(AccountActions.changeRealName.success, this.triggerWrapper(CHANGE_REALNAME, true));
    this.listenTo(AccountActions.changeRealName.failed, this.triggerWrapper(CHANGE_REALNAME, false));
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
  /* The Store! */
  NotifyStore,
};
