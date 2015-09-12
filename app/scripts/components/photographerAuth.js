var React = require('react');
var React = require('react');
var Router = require('react-router');
var Link  = Router.Link;
var Reflux = require('reflux');
var UserStore = require('../stores/UserStore');

var validator = require('validator');
var UserActions = require('../actions/UserActions');
var UserNameInput = require('./user/userNameInput');
var UserPasswordInput = require('./user/userPasswordInput');
var AlertBox = require('./user/alertBox');
var Panel = require('react-bootstrap').Panel;
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;


var AuthHeader = React.createClass({
  render : function(){
    return (
      <div className="row">
        <div className="col-sm-8">
          <span><h3>摄影师认证</h3></span>
        </div>
        <div className="col-sm-4">
          <span>未认证</span>
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

var RealName = React.createClass({
  render : function(){
    return (
      <TextInput labelName="姓名：" placeholderName="真实姓名"/>
      )
  }
});

var ContactPhone = React.createClass({
  render : function(){
    return(
      <TextInput labelName="工作电话：" placeholderName=""/>

      );
  }
});

var Wechat = React.createClass({
  render : function(){
    return(
      <TextInput labelName="微信：" placeholderName=""/>

      );
  }
});

var QQNumber = React.createClass({
  render : function(){
    return(
      <TextInput labelName="QQ：" placeholderName=""/>
      );
  }
});

var PersonIDNumber = React.createClass({
  render : function(){
    return(
      <TextInput labelName="身份证号码：" placeholderName=""/>

      );
  }
});

var PersonIntro = React.createClass({
  render : function(){
    return(
      <TextInput labelName="个人简介：" placeholderName="他很懒什么都没有留下" textClassName="col-sm-6" validatedClass="warning"/>

      );
  }
});

var CompanyName = React.createClass({
  render : function(){
    return(
      <TextInput labelName="工作室名称：" placeholderName=""/>

      );
  }
});

var Province = React.createClass({
  render : function(){
    return(
      <div className="form-group">
        <Input type="select" label="地区：" labelClassName='col-xs-2' wrapperClassName="col-xs-6">
          <option value="1">郑州</option>
        </Input>
      </div>

      );
  }
});

var Address = React.createClass({
  render : function(){
    return(
      <TextInput labelName="详细地址：" placeholderName=""/>

      );
  }
});

/*
  身份证图片上传
*/
var PersonIDImage = React.createClass({
  chooseIDPicture1 : function () {
    React.findDOMNode(this.refs.IDPicture1).click();
  },
  handleIDPicture1 : function () {
    var fileinput = React.findDOMNode(this.refs.IDPicture1);
    console.log(fileinput.value);
  },
  chooseIDPicture2 : function () {
    React.findDOMNode(this.refs.IDPicture2).click();
  },
  handleIDPicture2 : function () {
    var fileinput = React.findDOMNode(this.refs.IDPicture2);
    console.log(fileinput.value);
  },
  render : function(){
    return (
      <div className="form-group">
        <label className="control-label col-xs-2">身份证正反面：</label>
        <div className="col-xs-6">
          <div className="row">
            <div className="col-xs-6">
              <img src="img/id1.png" onClick={this.chooseIDPicture1}/>
              <input type="file" ref="IDPicture1" className="hidden" onChange={this.handleIDPicture1}/>
            </div>
            <div className="col-xs-6">
              <img src="img/id2.png" onClick={this.chooseIDPicture2}/>
              <input type="file" ref="IDPicture2" className="hidden" onChange={this.handleIDPicture2}/>
            </div>
          </div>

          <div className="row">
            <div className="col-xs-6">
              <img src="img/id_shili.png" />
            </div>
            <div className="col-xs-6">
              <div>
                1 正反面带头像的清晰照片<br />
                2 照片大小不超过3M <br />
                3 仅用于认证请放心上传
              </div>
            </div>
          </div>
        </div>
      </div>
      );
  }
});


var PersonProduct = React.createClass({
  render : function(){
    return (
      <div className="form-group">
        <label className="control-label col-xs-2">个人作品：</label>
        <div className="col-xs-6">
          <img src="img/tianjia.png" />
        </div>
      </div>
      )
  }
});

var hasCompany = React.createClass({
  render : function () {
    return (
      <div className= "form-group">
        <label className="control-label col-xs-2">是否有工作室：</label>
      </div>
      );
  }
});

var CompanyLogo = React.createClass({
  render : function () {
    return (
      <div className="form-group">
        <label className="control-label col-xs-2">工作室LOGO：</label>
        <div className="col-xs-6">
          <img src="img/logo_up.png" />
        </div>
      </div>
      );
  }
});

var CompnayIntro = React.createClass({
  render : function(){
    return (
      <div className="form-group">
        <Input type="textarea" label="工作室简介：" labelClassName='col-xs-2' wrapperClassName="col-xs-6"/>
      </div>
      );
  }
});

var PhotographerAuth = React.createClass({
  getInintialState: function(){
    return {
      authState : '0'
    }
  },
  render: function() {

    return (
          <Panel>
            <AuthHeader />
            <form className='form-horizontal'>
              <RealName />
              <ContactPhone />
              <Wechat />
              <QQNumber />
              <PersonIDNumber />
              <PersonIDImage />
              <PersonIntro />
              <PersonProduct />
              <CompanyName />
              <CompanyLogo />
              <Province />
              <Address />
              <CompnayIntro />
              <Button bsStyle="primary">提交</Button>
            </form>
          </Panel>
    );
  }
});

module.exports = PhotographerAuth;
