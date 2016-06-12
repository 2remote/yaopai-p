var React = require('react');
var Reflux = require('reflux');
var { Link } = require('react-router');
var History = require('react-router').History;
var TextInput = require('../account/textInput');
var ImageInput = require('../account/imageInput');
var ToolTip = require('../toolTip');
var AccountActions = require("../../actions/AccountActions");
var AccountStore = require('../../stores/AccountStore');
var UserStore = require("../../stores/UserStore");

/*
  身份证图片上传
*/
var PersonIDImage = React.createClass({
  getInitialState: function() {
    return {
      facecodeDefaultImage : 'img/facecode.png',
      oppositeDefaultImage : 'img/opposite.png',
    }
  },
  getValue: function() {
    var v1 = this.refs.IDPicture1.getValue();
    var v2 = this.refs.IDPicture2.getValue();
    if(v1 && v2 && v1!=this.state.facecodeDefaultImage && v2!=this.state.oppositeDefaultImage){
      return v1+','+v2;
    }else{
      return null;
    }
  },
  upload1: function(url) {
    this.props.upload1(url);
  },
  upload2: function(url) {
    this.props.upload2(url);
  },
  render: function() {
    var style = {
      imgId: {
        marginBottom: '14px',
      },
      info: {
        marginLeft: '70px',
        height: '150px',
        paddingTop: '36px',
      },
      label: {
        lineHeight: '150px',
      },
    };
    var IDImages = [];
    IDImages[0] = this.state.facecodeDefaultImage;
    IDImages[1] = this.state.oppositeDefaultImage;
    if(this.props.value){
      var tmp = this.props.value.split(',');
      if(tmp[0])
        IDImages[0] = tmp[0];
      if(tmp[1])
        IDImages[1] = tmp[1];
    }
    return (
      <div className="form-group">
        <label className="control-label col-xs-3" style={style.label}>身份证正反面：</label>
        <div className="col-xs-9">
          <div className="row" style={style.imgId}>
            <ImageInput width="200"
              height="150"
              addStyle={{width:220}}
              defaultImage={IDImages[0]}
              onUpload={this.upload1}
              onError={this.props.showMessage}
              disabled={this.props.disabled}
              multi_selection={false}
              uid="IDPicture1"
              ref="IDPicture1"
              type="user"/>
            <ImageInput width="200"
              height="150"
              addStyle={{width:220}}
              defaultImage={IDImages[1]}
              onUpload={this.upload2}
              onError={this.props.showMessage}
              disabled={this.props.disabled}
              multi_selection={false}
              uid="IDPicture2"
              ref="IDPicture2"
              type="user"/>
          </div>
          <div className="row">
            <div className="col-xs-4">
              <img height="150" width="200" src="img/id_shili.png" />
            </div>
            <div className="col-xs-8">
              <div style={style.info}>
                1 正反面带头像的清晰照片<br />
                2 仅用于认证请放心上传
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

var AuthRealName = React.createClass({
  mixins: [
    /* 用户基本信息只需要调用User.CurrentUser */
    /* 下面那个AccountStore里有个User.CurrentUserDetail相关的action */
    Reflux.listenTo(UserStore, 'onUserStoreChange'),
    Reflux.listenTo(AccountStore, 'onchangeRealNameComplete'),
    History
  ],
  onUserStoreChange: function() {

  },
  onchangeRealNameComplete: function(msg) {
    if(msg.flag === 'changeRealName') { // 这才是真的updateInfo结果
      if(msg.changeSuccess) {
        this.history.replaceState(null, '/account/pAuth/submitaudit');
      } else {
        // TODO: 报错
        this.showMessage(msg.hintMessage);
        // alert(msg.hintMessage);
      }
    }
  },
  getInitialState: function() {
    return {
      authState : '0',
      disabled : false,
      pAuthData : {}
    }
  },
  updateRealName: function(result) {
    var data = this.state.pAuthData;
    data.RealName = result;
    this.setState({pAuthData : data})
  },
  updatePersonID: function(result) {
    var data = this.state.pAuthData;
    data.IdNumber = result;
    this.setState({pAuthData : data});
  },
  updateIDImage1: function(result) {
    var IDImages = [];
    if(this.state.pAuthData.IdNumberImages){
      IDImages = this.state.pAuthData.IdNumberImages.split(',');
      IDImages[0] = result;
    }else{
      IDImages[0] = result;
      IDImages[1] = '';
    }
    var data = this.state.pAuthData;
    data.IdNumberImages = IDImages.toString();
    this.setState({pAuthData : data});
  },
  updateIDImage2: function(result) {
    var IDImages = [];
    if(this.state.pAuthData.IdNumberImages){
      IDImages = this.state.pAuthData.IdNumberImages.split(',');
      IDImages[1] = result;
    }else{
      IDImages[0] = '';
      IDImages[1] = result;
    }
    var data = this.state.pAuthData;
    data.IdNumberImages = IDImages.toString();
    this.setState({pAuthData : data});
  },
  showMessage: function(message) {
    this.refs.toolTip.toShow(message);
  },
  onSubmit: function(e) {
    AccountActions.changeRealName({
      RealName:this.state.pAuthData.RealName,
      IdNumber:this.state.pAuthData.IdNumber,
      IdNumberImages:this.state.pAuthData.IdNumberImages,
    });
    // console.log('[pAuthData]', this.state.pAuthData);
    e.preventDefault();
  },
  render: function() {
    return (
      <form className="form-horizontal" onSubmit={ this.onSubmit }>
        <TextInput ref="realName"
          labelName="姓名："
          value = {this.state.pAuthData.RealName}
          updateValue = {this.updateRealName}
          minLength={2}
          disabled={this.state.disabled}
          textClassName="col-xs-5"
          placeholder="请输入您的真实姓名"/>
        <TextInput ref="IDNumber"
          labelName="身份证号码："
          value = {this.state.pAuthData.IdNumber}
          updateValue = {this.updatePersonID}
          minLength={15}
          disabled={this.state.disabled}
          textClassName="col-xs-5"
          placeholder="请输入您的身份证号码"/>
        <PersonIDImage ref = "personIDImage"
          value = {this.state.pAuthData.IdNumberImages}
          upload1 = {this.updateIDImage1}
          upload2 = {this.updateIDImage2}
          showMessage = {this.showMessage}
          disabled = {this.state.disabled}
        />
        <div className="form-group">
          <div className="col-xs-offset-3 col-xs-9">
            <button type="submit" className="btn btn-primary">下一步</button>
          </div>
        </div>
        <ToolTip ref="toolTip" title=""/>
      </form>
    );
  },
});

module.exports = AuthRealName;
