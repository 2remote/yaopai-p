var React = require('react');
import { Link } from 'react-router'
var Reflux = require('reflux');
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var AccountInfo = require("./accountInfo");
var ImageInput = require("./account/imageInput");
var AccountActions = require("../actions/AccountActions");
var AccountStore = require("../stores/AccountStore");
var UserActions = require("../actions/UserActions");
var UserStore = require("../stores/UserStore");
var TextInput = require('./account/textInput');
var InfoHeader = require('./infoHeader');
var ToolTip = require('./toolTip');
import { History } from 'react-router'
var AreaSelect = require('./account/areaSelect');
var FormControls = require('react-bootstrap').FormControls;

import { ROUTE_LOGIN,ROUTE_ACCOUNT_PASSWORD } from '../routeConfig'

var UserImage = React.createClass({
  mixins : [Reflux.listenTo(AccountStore,'onUpdateAvatar')],
  componentDidMount : function(){

  },
  onUpload : function(avatarUrl){
    AccountActions.changeAvatar({Avatar : avatarUrl});
    this.props.updateAvatar(avatarUrl);
  },
  onUpdateAvatar : function(data){
    if(data.flag == 'avatar'){
      console.log(data);
    }
  },
  render : function() {
    var image = 'img/default_user_img.png';
    var style = {
      label: {
        lineHeight: '150px',
        verticalAlign: 'top',
      }
    };
    if(this.props.defaultImage){
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
  }
});
var UserGender = React.createClass({
  getInitialState : function(){
    return {
      gender : 1,
    }
  },
  getValue : function(){
    return this.state.gender;
  },
  /*
   暂时先这样写，之后考虑用相应的控件
   */
  beMan : function(){
    this.setState({gender : 1});
    this.props.updateValue(1);
  },
  beWeman : function(){
    this.setState({gender : 0});
    this.props.updateValue(0);
  },
  render : function  () {
    var style = {
      commonButton: {
        paddingLeft: '30px',
        paddingRight: '30px',
        marginRight: '20px',
      },
    };
    var buttons;
    if(this.props.value == 1){
      buttons = (
        <div className="col-xs-5">
          <Button disabled={this.props.disabled} bsStyle="primary" style={style.commonButton} onClick={this.beMan} active>男</Button>
          <Button disabled={this.props.disabled} style={style.commonButton} onClick={this.beWeman}>女</Button>
        </div>
      );
    }else{
      buttons = (
        <div className="col-xs-5">
          <Button disabled={this.props.disabled} style={style.commonButton} onClick={this.beMan} >男</Button>
          <Button disabled={this.props.disabled} bsStyle="primary" style={style.commonButton} onClick={this.beWeman} active>女</Button>
        </div>
      )
    }
    return (
      <div className="form-group">
        <label className="control-label col-xs-3">性别：</label>
        {buttons}
      </div>
    );
  }
});

var PersonInfo = React.createClass({
  mixins : [Reflux.listenTo(AccountStore,'onAccountChanged'), Reflux.listenTo(UserStore,'onUserStoreChange'),History],
  getInitialState : function(){
    return {
      //nickName : '',
      //gender : 1,
      //avatar : '',
      editable : true
    }
  },
  updateInfo : function(e){
    e.preventDefault && e.preventDefault()
    var message = this.validate();
    if(!message) {
      AccountActions.updateInfo({
        NickName: this.state.NickName,
        Sex: this.state.Sex,
        Location: this.state.CountyId || this.state.CityId || this.state.ProvinceId,
        Signature: this.state.Signature
      });
      AccountActions.changeContactDetail({
        ContactOicq: this.state.Account.ContactOicq,
        ContactWeibo: this.state.Account.ContactWeibo,
        ContactWeixin: this.state.Account.ContactWeixin
      });
    }else{
      this.showMessage(message);
    }
  },
  validate : function() {
    var message = '';
    if (!this.refs.nickName.isValidated()) {
      message = '昵称最少2个字';
      return message;
    }
    if (!this.refs.wechat.isValidated()) {
      message = '微信最少3位';
      return message;
    }
    if (!this.refs.qq.isValidated()) {
      message = 'qq最少5位';
      return message;
    }
    if (!this.refs.weibo.isValidated()) {
      message = '微博最少5位';
      return message;
    }
  },
  componentDidMount : function(){
    UserActions.currentUser();
  },
  onUserStoreChange : function(data){
    if(data.isLogin){
      if(data.local){
        //本地用户，需要读取用户详细信息
        this.setState({editable : true});
        AccountActions.userDetail({Fields:'Id,NickName,Sex,Avatar,Signature,ProvinceId,CityId,CountyId,Account.ContactWeibo,Account.ContactWeixin,Account.ContactOicq,Account.Tel'});
      }else{
        //三方登录用户，显示用户信息，不能修改信息
        this.setState({NickName : data.userName, Avatar : data.avatar, editable : false})
      }
    }else{
      //没有登录跳转到首页登录界面
      UserActions.logout(true);
      this.history.pushState(null, ROUTE_LOGIN);
    }
  },
  onAccountChanged : function(data){
    if(data.flag == 'userDetail'){
      if(data.detail){
        //this.setState({
        //  nickName : data.detail.NickName,
        //  gender : data.detail.Sex,
        //  avatar : data.detail.Avatar
        //});
        this.setState(data.detail);

      }else{
        this.showMessage(data.hitMessage);
      }
    }
    if(data.flag == 'updateInfo'){
      console.log(data.hintMessage);
      this.showMessage(data.hintMessage);
      UserActions.currentUser();
    }
  },
  showMessage : function(message){
    this.refs.toolTip.toShow(message);
  },
  updateNickName : function(v){
    this.setState({NickName : v});
  },
  updateGender : function(gender){
    this.setState({Sex : gender});
  },
  updateAvatar : function(avatar){
    this.setState({Avatar : avatar});
  },
  onProvinceChange : function(result){
    var data = this.state.Account;
    data.ProvinceId = result;
    data.CityId = 0 ;
    data.CountyId = 0 ;
    this.setState({ProvinceId : result,CityId : 0,CountyId : 0});
  },
  onCityChange : function(result){
    this.setState({CityId:result,CountyId :0});
  },
  onDistrictChange : function(result){
    this.setState({CountyId : result});
  },
  //updateWorkPhone : function(result){
  //  var data = this.state.Account;
  //  data.Tel = result;
  //  this.setState({Account : data});
  //},
  updateWechat : function(result){
    var data = this.state.Account;
    data.ContactWeixin = result;
    this.setState({Account : data});
  },
  updateWeibo : function(result){
    var data = this.state.Account;
    data.ContactWeibo = result;
    this.setState({Account : data});
  },
  updateQQ : function(result){
    var data = this.state.Account;
    data.ContactOicq = result;
    this.setState({Account : data});
  },
  updateSign : function(result){
    this.setState({Signature : result});
  },
  render: function() {
    var style = {
      outer: {
        backgroundColor: '#fff',
        padding: '40px 60px 70px 60px',
      }
    };
    return (
      <div style={style.outer}>
        <ul id="myTab" className="nav nav-tabs">
          <li className="active">
            <a href="#basic" data-toggle="tab">
              基本信息
            </a>
          </li>
          <li><a href="#m" data-toggle="tab">模特完善</a></li>
          <li><a href="#pwd" data-toggle="tab">修改密码</a></li>
        </ul>
        <div id="myTabContent" className="tab-content">
          <div className="tab-pane fade in active" id="basic">
            <form className='form-horizontal'>
              <UserImage defaultImage={this.state.Avatar} updateAvatar={this.updateAvatar} disabled={!this.state.editable} showMessage={this.showMessage}/>
              <FormControls.Static label="电话："
                                   labelClassName="col-xs-3"
                                   wrapperClassName="col-xs-4"
                                   value={this.state.Account?this.state.Account.Tel:''} />
              <TextInput ref="nickName"
                         labelName="昵称："
                         value={this.state.NickName}
                         updateValue={this.updateNickName}
                         textClassName='col-xs-3'
                         minLength={2}
                         disabled={!this.state.editable}/>
              <UserGender ref="gender" value={this.state.Sex} updateValue={this.updateGender} disabled={!this.state.editable}/>
              <AreaSelect ref="area"
                          province = {this.state.ProvinceId}
                          onProvinceChange={this.onProvinceChange}
                          city = {this.state.CityId}
                          onCityChange = {this.onCityChange}
                          district = {this.state.CountyId}
                          onDistrictChange = {this.onDistrictChange}
                          disabled={this.state.disabled}/>
              <TextInput ref="wechat"
                         labelName="微信："
                         value = {this.state.Account?this.state.Account.ContactWeixin:''}
                         updateValue = {this.updateWechat}
                         minLength={3}
                         disabled={this.state.disabled}
                         textClassName="col-xs-4"
                         placeholder=""/>
              <TextInput ref="qq"
                         labelName="QQ："
                         value = {this.state.Account?this.state.Account.ContactOicq:''}
                         updateValue = {this.updateQQ}
                         minLength={5}
                         disabled={this.state.disabled}
                         textClassName="col-xs-4"
                         placeholder=""/>
              <TextInput ref="weibo"
                         labelName="微博："
                         value = {this.state.Account?this.state.Account.ContactWeibo:''}
                         updateValue = {this.updateWeibo}
                         minLength={5}
                         disabled={this.state.disabled}
                         textClassName="col-xs-4"
                         placeholder=""/>
              <TextInput ref="personIntro"
                         type='textarea'
                         labelName="个性签名："
                         value = {this.state.Signature}
                         updateValue = {this.updateSign}
                         minLength={1}
                         maxLength={100}
                         disabled={this.state.disabled}
                         textClassName="col-xs-4"
                         defaultValue="他很懒什么都没有留下"
                         placeholder="他很懒什么都没有留下"/>
              <button className="btn btn-primary col-xs-offset-3" onClick={this.updateInfo} disabled={!this.state.editable}>保存</button>
              <ToolTip ref="toolTip" title=""/>
            </form>
          </div>
          <div className="tab-pane fade" id="m">
            <p>暂无</p>
          </div>
          <div className="tab-pane fade" id="pwd">
            <AccountInfo />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = PersonInfo;
