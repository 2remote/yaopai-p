var React = require('react');

var Reflux = require('reflux');
var Panel = require('react-bootstrap').Panel;
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;

var ImageInput = require("./account/imageInput");
var AccountActions = require("../actions/AccountActions");
var AccountStore = require("../stores/AccountStore");
var TextInput = require('./account/textInput');

var InfoHeader = React.createClass({
  render: function () {
    var style = {
      headerInfo: {
        fontSize: '22px',
        color: '#777777',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: '#e8e8e8',
      },
      title: {
        paddingLeft: '20px',
      }
    };
    return (
      <div style={style.headerInfo} className="header-info">
        <span className="glyphicon glyphicon-user" aria-hidden="true"></span>
        <span style={style.title} className="title">个人信息</span>
      </div>
    );
  }
});

var UserImage = React.createClass({
  mixins : [Reflux.listenTo(AccountStore,'onUpdateAvatar')],
  componentDidMount : function(){

  },
  onUpload : function(avatorUrl){
    AccountActions.changeAvatar({Avatar : avatorUrl});
  },
  onUpdateAvatar : function(data){
    if(data.flag == 'avatar'){
      console.log(data);
    }
  },
  render : function() {
    var image = 'img/default_user_img.png';
    if(this.props.defaultImage){
      image = this.props.defaultImage;
    }
    return (
        <div className="form-group">
          <label className="control-label col-xs-2">头像：</label>
          <div id="uploadAvatorC" className="col-xs-4">
            <ImageInput uid="uploadAvator" type="user" defaultImage={image} onUpload={this.onUpload}/>
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
  },
  beWeman : function(){
    this.setState({gender : 0});
  },
  render : function  () {
    var buttons;
    if(this.state.gender == 1){
      buttons = (
        <div className="col-xs-4">
          <Button onClick={this.beMan} active>男</Button>
          <Button onClick={this.beWeman}>女</Button>
        </div>
      );
    }else{
      buttons = (
        <div className="col-xs-4">
          <Button onClick={this.beMan} >男</Button>
          <Button onClick={this.beWeman} active>女</Button>
        </div>
      )
    }
    return (
      <div className="form-group">
        <label className="control-label col-xs-2">性别</label>
          {buttons}
      </div>
    );
  }
});

var PersonInfo = React.createClass({
  mixins : [Reflux.listenTo(AccountStore,'onAccountChanged')],
  getInitialState : function(){
    return {
      info : {
        id : '',
        nickName : '',
        gender : '',
        avatar : ''
      }
    }
  },
  updateInfo : function(){
    var nickName = this.refs.nickName.getValue();
    var gender = this.refs.gender.getValue();
    AccountActions.updateInfo({NickName:nickName,Sex:gender});
  },
  componentDidMount : function(){
    AccountActions.userDetail({Fields:'Id,NickName,Sex,Avatar'});
  },
  onAccountChanged : function(data){
    if(data.flag == 'userDetail'){
      if(data.detail){
        this.setState({info : {
          nickName : data.detail.NickName,
          gender : data.detail.Sex,
          avatar : data.detail.Avatar
        }});
        this.refs.nickName.setState({value : data.detail.NickName});
      }else{
        //未取得userdetail
        console.log(data.hitMessage);
      }
    }
    if(data.flag == 'updateInfo'){

    }
  },
  render: function() {
    return (
      <div>
        <form className='form-horizontal'>
          <InfoHeader />
          <UserImage defaultImage={this.state.info.avatar}/>
          <TextInput ref="nickName" labelName="昵称：" defaultValue={this.state.info.nickName} textClassName='col-xs-4'/>
          <UserGender ref="gender" defaultValue={this.state.info.gender}/>
          <button className="btn btn-primary" onClick={this.updateInfo}>保存</button>
        </form>
      </div>
    );
  }
});

module.exports = PersonInfo;