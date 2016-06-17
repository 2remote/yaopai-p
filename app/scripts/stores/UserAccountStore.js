/**
 * 之前UserStore和AccountStore存的数据比较乱，后台把这些都当作用户数据来看，就放在一起吧
**/
var Reflux = require('reflux');
var UserActions = require('../actions/UserActions');
var AccountActions = require('../actions/AccountActions');

/* 基础类型 */
const USERACCOUNT_TYPE_DEFAULT = '游客';
const USERACCOUNT_TYPE_NORMAL = '普通';
const USERACCOUNT_TYPE_THIRD = '三方';
/* 专业类型掩码 */
const USERPROFESSIONAL_MASK_PHOTOGRAPHER = 1;
const USERPROFESSIONAL_MASK_MAKEUPARTIST = 2;
const USERPROFESSIONAL_MASK_MOTE = 4;
/* 性别 */
const USERACCOUNT_GENDER_UNKNOWN = '不明';
const USERACCOUNT_GENDER_FEMALE = '女';
const USERACCOUNT_GENDER_MALE = '男';

/**
 * 判断用户是普通用户还是三方用户
**/
const convertUserAccountType = function(serverType) {
  return serverType ? USERACCOUNT_TYPE_NORMAL : USERACCOUNT_TYPE_THIRD;
};

/**
 * 位运算获取用户professional身份
**/
const convertProfessions = function(serverType, mask) {
  return !!(serverType & mask); // 双!!返回boolean
};

/**
 * 转换用户性别值
**/
const convertGender = function(serverGender) {
  return serverGender === 0 ? USERACCOUNT_GENDER_FEMALE :
    serverGender === 1 ? USERACCOUNT_GENDER_MALE :
    USERACCOUNT_GENDER_UNKNOWN;
};

/**
 * 填充用户数据，把this做为第一个参传过来了
 * 把后台数据转换成前端数据是为了相对后台独立
 * TODO：理论上与后台交互的事应该由action全程完成，包括转换，这样http请求从哪进就从哪“卸载”过来
**/
const fillUserBasicInfo = function(self, tokens, userInfo) {
  self.isLogin = true;
  self.loginToken = tokens.LoginToken;
  self.sessionToken = tokens.SessionToken || userInfo.SessionToken;
  self.basic = {
    professions: {},
  };
  self.basic.id = userInfo.Id;
  self.basic.type = convertUserAccountType(userInfo.Local);
  self.basic.professions.photographer
    = convertProfessions(userInfo.Type, USERPROFESSIONAL_MASK_PHOTOGRAPHER);
  self.basic.professions.makeupArtist
    = convertProfessions(userInfo.Type, USERPROFESSIONAL_MASK_MAKEUPARTIST);
  self.basic.professions.mote
    = convertProfessions(userInfo.Type, USERPROFESSIONAL_MASK_MOTE);
  if(userInfo.Name) {
    self.basic.nickname = userInfo.Name;
  }
  if(userInfo.NickName) {
    self.basic.nickname = userInfo.NickName;
  }
  self.basic.gender = convertGender(userInfo.Sex);
  self.basic.avatar = userInfo.Avatar;
  self.basic.signature = userInfo.Signature;
  self.basic.complete = userInfo.IsCompleteness;
  self.basic.province = userInfo.ProvinceId;
  self.basic.city = userInfo.CityId;
  self.basic.county = userInfo.CountyId;
  // console.log('The fillUserBasicInfo function decided to have himself heared, Errr!', self);
};

/**
 * 用户信息
 */
const UserAccountStore = Reflux.createStore({
  getInitialState: function() {
    // Reflux的store也有初始化，但不是getInitialState而是init
    // 这个getInitialState是用于与React组件做mixins的时候调connect用的
    return this.data;
  },
  init: function() {
    this.listenTo(UserActions.login.success, this.onLogin);
    this.listenTo(UserActions.loginWithToken.success, this.onLogin);
    this.listenTo(UserActions.logout.success, this.onLogout);
    this.listenTo(UserActions.currentServerUser.success, this.onCurrentUser);
    this.listenTo(AccountActions.userDetail.success, this.onCurrentUserDetail);
    this.listenTo(AccountActions.changeAvatar.success, this.onChangeAvatar);
    this.listenTo(AccountActions.updateInfo.success, this.onUpdateInfo);
    /**
     * 用户信息包含：
     * SessionToken: 客户端会话令牌
     * Local: 是否为平台用户(False为三方登陆用户)
     * Type: 用户类型,使用位运算 见备注 (三方用户不具有此属性)
     * TypeString: 用户文本类型 , 见备注  (三方用户不具有此属性)
     * Id: Id
     * Name: 昵称
     * Sex: 性别
     * Avatar: 头像地址
     * Signature: 个性签名
     * IsCompleteness: 个人信息是否完整
     * ProvinceId: 省Id
     * ProvinceName: 省名称
     * CityId: 市Id
     * CityName: 市名称
     * CountyId: 区Id
     * CountyName: 区名称
     */
    this.data = {
      isLogin: false,
      loginToken: '',
      sessionToken: '',
      basic: {
        type: USERACCOUNT_TYPE_DEFAULT,
        professions: {
          photographer: false,
          makeupArtist: false,
          mote: false,
        },
        id: NaN,
        nickname: '',
        gender: USERACCOUNT_GENDER_MALE,
        avatar: '', // TODO: 有默认头像的设定吗？
        signature: '',
        complete: false,
        province: 0,
        city: 0,
        county: 0,
      },
      account: {},
    };
  },
  onLogin: function(resp) {
    const self = this;
    let data = self.data;
    // TODO: 话说resp.Success可不可以让action去处理，甚至让httpFactory直接封装了？
    if(resp.Success) {
      fillUserBasicInfo(data, resp, resp.User);
      self.trigger(data);
    }
  },
  onLogout: function(resp) {
    if(resp.Success) {
      const self = this;
      let data = self.data;
      /* clear up */
      data.isLogin = false;
      data.loginToken = '';
      data.sessionToken = '';
      data.basic = {
        professions: {},
      };
      // TODO: 某天要把LocalStorage也清掉
      self.trigger(data);
    }
  },
  onCurrentUser: function(resp) {
    const self = this;
    let data = self.data;
    if(resp.Success) {
      fillUserBasicInfo(data, {}, resp);
      self.trigger(data);
    }
  },
  onCurrentUserDetail: function(resp) {

  },
  onChangeAvatar: function(resp, avatar) {
    const self = this;
    let data = self.data;
    if(resp.Success) {
      data.basic.avatar = avatar.Avatar;
      self.trigger(data);
    }
  },
  onUpdateInfo: function(resp, submitData) {
    const self = this;
    let data = self.data;
    if(resp.Success) {
      data.basic.nickname = submitData.NickName;
      data.basic.gender = submitData.Sex;
      data.basic.province = submitData.ProvinceId;
      data.basic.city = submitData.CityId;
      data.basic.county = submitData.CountyId;
      data.basic.complete = true;
      self.trigger(data);
    }
  },
});

module.exports = UserAccountStore;
