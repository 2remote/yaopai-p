var React = require('react');

var Reflux = require('reflux');
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;

var ImageInput = require("./account/imageInput");
var AccountActions = require("../actions/AccountActions");
var AccountStore = require("../stores/AccountStore");
var UserActions = require("../actions/UserActions");
var TextInput = require('./account/textInput');
var InfoHeader = require('./infoHeader');
var ToolTip = require('./toolTip');
var History = require('react-router').History;

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
          <label className="control-label col-xs-2" style={style.label}>头像：</label>
          <div id="uploadAvatorC" className="col-xs-4">
            <ImageInput width="150" height="150" uid="uploadAvator" type="user" defaultImage={image} onUpload={this.onUpload} circle="1"/>
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
        <div className="col-xs-4">
          <Button bsStyle="primary" style={style.commonButton} onClick={this.beMan} active>男</Button>
          <Button style={style.commonButton} onClick={this.beWeman}>女</Button>
        </div>
      );
    }else{
      buttons = (
        <div className="col-xs-4">
          <Button style={style.commonButton} onClick={this.beMan} >男</Button>
          <Button bsStyle="primary" style={style.commonButton} onClick={this.beWeman} active>女</Button>
        </div>
      )
    }
    return (
      <div className="form-group">
        <label className="control-label col-xs-2">性别：</label>
          {buttons}
      </div>
    );
  }
});

var PersonInfo = React.createClass({
  mixins : [Reflux.listenTo(AccountStore,'onAccountChanged'),History],
  getInitialState : function(){
    return {
      nickName : '',
      gender : '',
      avatar : ''
    }
  },
  updateInfo : function(){
    AccountActions.updateInfo({
      NickName:this.state.nickName,
      Sex:this.state.gender
    });
  },
  componentDidMount : function(){
    AccountActions.userDetail({Fields:'Id,NickName,Sex,Avatar'});
  },
  onAccountChanged : function(data){
    if(data.flag == 'userDetail'){
      if(data.detail){
        console.log(data.detail);
        this.setState({
          nickName : data.detail.NickName,
          gender : data.detail.Sex,
          avatar : data.detail.Avatar
        });
      }else{
        //未取得userdetail
        console.log(data.hitMessage);
        this.history.pushState(null,'/');
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
    this.setState({nickName : v});
  },
  updateGender : function(gender){
    this.setState({gender : gender});
  },
  updateAvatar : function(avatar){
    this.setState({avatar : avatar});
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
        <InfoHeader infoTitle="个人信息" infoIconClass="glyphicon glyphicon-user"/>
        <form className='form-horizontal'>
          <UserImage defaultImage={this.state.avatar} updateAvatar={this.updateAvatar}/>
          <TextInput ref="nickName" 
            labelName="昵称：" 
            value={this.state.nickName} 
            updateValue={this.updateNickName} 
            textClassName='col-xs-3'/>
          <UserGender ref="gender" value={this.state.gender} updateValue={this.updateGender}/>
          <button className="btn btn-primary col-xs-offset-2" onClick={this.updateInfo}>保存</button>
          <ToolTip ref="toolTip" title=""/>
        </form>
      </div>
    );
  }
});

module.exports = PersonInfo;