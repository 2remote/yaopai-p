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
  render : function(){
    return (
      <Input type="text" 
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
  componentDidMount : function(){

  },
  onUpload : function(avatorUrl){
    AccountActions.changeAvator({Avator : avatorUrl});
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
  render : function  () {
    return (
      <div className="form-group">
        <label className="control-label col-xs-2">性别：</label>
        <div className="col-xs-4">
          <Button>男</Button>
          <Button>女</Button>
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

  render: function() {

    return (
      <Panel>
        <form className='form-horizontal'>
          <InfoHeader />
          <UserImage />
          <TextInput labelName="昵称：" />
          <UserGender />
          <District />
          <button className="btn btn-primary">保存</button>
        </form>
      </Panel>
    );
  }
});

module.exports = PersonInfo;
