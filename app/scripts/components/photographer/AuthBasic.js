var React = require('react');
var { Link } = require('react-router');
var TextInput = require('../account/textInput');
var ImageInput = require("../account/imageInput");
var AreaSelect = require('../account/areaSelect');
var Reflux = require('reflux');
var AccountActions = require("../../actions/AccountActions");
var UserActions = require("../../actions/UserActions");
var AccountStore = require('../../stores/AccountStore');
var UserStore = require("../../stores/UserStore");
var History = require('react-router').History;

var UserImage = React.createClass({
  mixins: [Reflux.listenTo(AccountStore,'onUpdateAvatar')],
  componentDidMount: function() {

  },
  onUpload: function(avatarUrl) {
    AccountActions.changeAvatar({Avatar : avatarUrl});
    this.props.updateAvatar(avatarUrl);
  },
  onUpdateAvatar: function(data) {
    if(data.flag == 'avatar') {
      console.log(data);
    }
  },
  render: function() {
    var image = 'img/default_user_img.png';
    var style = {
      label: {
        lineHeight: '150px',
        verticalAlign: 'top',
      }
    };
    if(this.props.defaultImage) {
      image = this.props.defaultImage;
    }
    return (
      <div className="form-group">
        <label className="control-label col-xs-3" style={style.label}>头像：</label>
        <div id="uploadAvatorC" className="col-xs-4">
          <ImageInput
            width="150"
            height="150"
            uid="uploadAvator"
            type="user"
            multi_selection={false}
            defaultImage={image}
            onUpload={this.onUpload}
            onError={this.props.showMessage}
            disabled = {this.props.disabled}
            circle="1"/>
        </div>
      </div>
    );
  },
});

/**
 * AuthBasic是认证第一步：填写基本信息
 * 所要填的信息有：
 * 1. avatar：上传头像（是的，就必须有，不然不让认证）
 * 2. nickname：用户昵称
 * 3. location：地区：
 *    3.1 province：省
 *    3.2 city：市
 *    3.3 district：区
 * 4. gender：性别（隐藏字段，接口需要，不用用户填写）
**/
const AuthBasic = React.createClass({
  mixins: [
    /* 用户基本信息只需要调用User.CurrentUser */
    /* 下面那个AccountStore里有个User.CurrentUserDetail相关的action */
    Reflux.listenTo(UserStore, 'onUserStoreChange'),
    Reflux.listenTo(AccountStore, 'onUpdateInfoComplete'),
    History
  ],
  getInitialState: function() {
    return {
      avatar: '', // 头像
      nickname: '', // 昵称
      location: { // 地区
        province: '', // 省
        city: '', // 市
        district: '', // 区
      },
      gender: '',
      editable: true, // 可否编辑
    }
  },
  /**
   *
  **/
  onUserStoreChange: function(data) {
    if(data.isLogin) {
      if(data.local) {
        // 用户基本信息回显给用户
        this.setState({
          avatar: data.avatar,
          nickname: data.userName,
          location: {
            province: data.provinceId,
            city: data.cityId,
            district: data.countyId,
          },
          gender: data.gender,
          editable: true,
        });
      } else {
        // TODO: 三方登录用户，显示用户信息，不能修改信息
        this.setState({
          avatar: data.Avatar,
          nickname: data.NickName,
          location: {
            province: data.ProvinceId,
            city: data.CityId,
            district: data.CountyId,
          },
          gender: data.Sex,
          editable: false,
        });
      }
    } else {
      //没有登录跳转到首页登录界面
      UserActions.logout(true);
      this.history.pushState(null, '/');
    }
  },
  /**
   * 使用AccountAction更新用户基本信息
   * 成功：跳转下一步
   * 失败：报错
  **/
  onUpdateInfoComplete: function(msg) {
    if(msg.flag === 'updateInfo') { // 这才是真的updateInfo结果
      if(msg.updateSuccess) {
        this.history.replaceState(null, '/account/pAuth/realname');
      } else {
        // TODO: 报错
        this.showMessage(msg.hintMessage);
        alert(msg.hintMessage);
      }
    }
  },
  updateAvatar: function(avatar) {
    console.log('updating avatar in AuthBasic...');
    this.setState({ avatar });
  },
  updateInfo: function(e) {
    console.log('updating...', this.state);
    var { nickname, gender, location } = this.state;
    // TODO: 条件限制
    AccountActions.updateInfo({
      NickName: nickname,
      Sex: gender,
      Location: location.district || location.city || location.province, // 地区 > 城市 > 省份
    });
    // TODO: 这里去更新一下UserStore（WTF）
    e.preventDefault();
  },
  updateNickName: function(nickname) {
    this.setState({ nickname });
  },
  /**
   * 更新这个component的state里存的province信息
   * TODO: 以下代码会把location变得只剩下province（wtf）
   * this.setState({
   *   location: {
   *     province: province,
   *   },
   * });
   * 看这里：http://stackoverflow.com/questions/24898012/react-js-setstate-overwriting-not-merging
   * 那么问题来了：
   * 这个bug在React里改了吗？哪个版本改的？/为啥不改？
  **/
  onProvinceChange: function(province) {
    this.setState({
      location: Object.assign({}, this.state.location, {
        province: province,
      }),
    });
  },
  onCityChange: function(city) {
    this.setState({
      location: Object.assign({}, this.state.location, {
        city: city,
      }),
    });
  },
  onDistrictChange: function(district) {
    this.setState({
      location: Object.assign({}, this.state.location, {
        district: district,
      }),
    });
  },
  showMessage: function(msg) {
    console.log('[ShowMessage @ AuthBasic]', msg);
  },
  render: function() {
    return (
      <form className='form-horizontal' onSubmit={this.updateInfo}>
        <div className="form-group">
          <label className="col-xs-12">
            小夏说：“不上传头像的别想实名认证！” 嗯，就是他说的。<br />
          </label>
        </div>
        <UserImage
          defaultImage={ this.state.avatar }
          updateAvatar={ this.updateAvatar }
          disabled={ !this.state.editable }
          showMessage={ this.showMessage }
        />
        <TextInput ref="nickName"
          labelName="昵称："
          value={ this.state.nickname }
          updateValue={ this.updateNickName }
          textClassName='col-xs-3'
          minLength={ 2 }
          disabled={ !this.state.editable }
        />
        <AreaSelect ref="area"
          province = { this.state.location.province }
          onProvinceChange={ this.onProvinceChange }
          city = { this.state.location.city }
          onCityChange = { this.onCityChange }
          district = { this.state.location.district }
          onDistrictChange = { this.onDistrictChange }
          disabled={ !this.state.editable }
        />
        <div className="form-group">
          <div className="col-xs-offset-3 col-xs-9">
            <button type="submit" className="btn btn-primary">下一步</button>
          </div>
        </div>
        <Link to="/account/pAuth/realname">下一步</Link>
      </form>
    )
  },
})

module.exports = AuthBasic;
