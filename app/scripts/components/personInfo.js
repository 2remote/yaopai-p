var React = require('react');

var Reflux = require('reflux');
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;

var ImageInput = require("./account/imageInput");
var AccountActions = require("../actions/AccountActions");
var AccountStore = require("../stores/AccountStore");
var TextInput = require('./account/textInput');
var InfoHeader = require('./infoHeader');

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
    var style = {
      commonButton: {
        paddingLeft: '30px',
        paddingRight: '30px',
        marginRight: '20px',
      },
    };
    var buttons;
    if(this.state.gender == 1){
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
          <UserImage defaultImage={this.state.info.avatar}/>
          <TextInput ref="nickName" labelName="昵称：" defaultValue={this.state.info.nickName} textClassName='col-xs-2'/>
          <UserGender ref="gender" defaultValue={this.state.info.gender}/>
          <button className="btn btn-primary col-xs-offset-2"onClick={this.updateInfo}>保存</button>
        </form>
      </div>
    );
  }
});

module.exports = PersonInfo;