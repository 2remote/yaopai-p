var React = require('react');
var Reflux = require('reflux');
var Panel = require('react-bootstrap').Panel;
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;

var ImageInput = require("./account/imageInput");
var AccountActions = require("../actions/AccountActions");
var AccountStore = require("../stores/AccountStore");

var InfoHeader = React.createClass({
  render : function(){
    return (
      <div className="row">
        <div className="col-sm-8">
          <span><h3>个人信息</h3></span>
        </div>
        <div className="line">
        </div>
      </div>
      )
  }
});

var TextInput = React.createClass({
  getDefaultProps : function(){
    return{
      textClassName : 'col-sm-4',
      validatedClass : ''
    }
  },
  getValue : function(){
    return this.refs.textInput.getValue();
  },
  render : function(){
    return (
      <Input type="text" 
        ref="textInput"
        bsStyle={this.props.validatedClass} 
        label={this.props.labelName} 
        placeholder={this.props.placeholderName} 
        labelClassName='col-xs-2' 
        wrapperClassName={this.props.textClassName}
        hasFeedback />
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
    console.log(data);
  },
  render : function() {
    return (
        <div className="form-group">
          <label className="control-label col-xs-2">头像：</label>
          <div id="uploadAvatorC" className="col-xs-4">
            <ImageInput uid="uploadAvator" type="user" defaultImage="img/default_user_img.png" onUpload={this.onUpload}/>
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
    this.setState({gender : 1});
  },
  render : function  () {
    return (
      <div className="form-group">
        <label className="control-label col-xs-2">性别：</label>
        <div className="col-xs-4">
          <Button onClick={this.beMan}>男</Button>
          <Button onClick={this.beWeman}>女</Button>
        </div>
      </div>
    );
  }
});

var District = React.createClass({
  render : function () {
    return (
      <Input type="select" 
        label="地区：" 
        placeholder={this.props.placeholderName} 
        labelClassName='col-xs-2' 
        wrapperClassName='col-xs-4'
        hasFeedback />
      );
  }

});

var PersonInfo = React.createClass({

  updateInfo : function(){
    var nickName = this.refs.nickName.getValue();
    var gender = this.refs.gender.getValue();
    AccountActions.updateInfo({NickName:nickName,Sex:gender});
  },

  render: function() {

    return (
      <Panel>
        <form className='form-horizontal'>
          <InfoHeader />
          <UserImage />
          <TextInput ref="nickName" labelName="昵称：" />
          <UserGender ref="gender" />
          <button className="btn btn-primary" onClick={this.updateInfo}>保存</button>
        </form>
      </Panel>
    );
  }
});

module.exports = PersonInfo;
