var React = require('react');
var Panel = require('react-bootstrap').Panel;
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;

var Reflux = require('reflux');
var UserStore = require('../stores/UserStore');
var UserActions = require('../actions/UserActions');

var AlertBox = require('./user/alertBox');

var InfoHeader = React.createClass({
  render : function(){
    return (
      <div className="row">
        <div className="col-sm-8">
          <span><h3>账户信息</h3></span>
        </div>
        <div className="line">
        </div>
      </div>
      )
  }
});

var PasswordInput = React.createClass({
  getDefaultProps : function(){
    return{
      textClassName : 'col-sm-4',
      validatedClass : ''
    }
  },
  getValue : function(){
    return this.refs.passwordInput.getValue();
  },
  render : function(){
    return (
      <Input type="password" 
        ref="passwordInput"
        bsStyle={this.props.validatedClass} 
        label={this.props.labelName} 
        placeholder={this.props.placeholderName} 
        labelClassName='col-xs-2' 
        wrapperClassName={this.props.textClassName}
        hasFeedback />
      );
  }
});

var ModifyPassword = React.createClass({
  mixins: [Reflux.listenTo(UserStore, 'handleModifyResult')],
  getInitialState : function(){
    return {
      alertMessage : '',
    }
  },
  /*
    接收修改密码结果
  */
  handleModifyResult : function(data){
    if(data.flag != "modifyPassword")return;
    this.setState({alertMessage : data.hintMessage});
  },
  handleModifyPassword : function(){
    var oldPass = this.refs.oldPass.getValue();
    var newPass = this.refs.newPass.getValue();
    var newPassRepeat = this.refs.newPassRepeat.getValue();
    if(!oldPass || oldPass=='') {
      this.setState({alertMessage:'原密码不能为空！'});
      return;
    }
    if(oldPass == newPass){
      this.setState({alertMessage : '新密码不能和原密码一样！'});
      return;
    }
    if(newPass != newPassRepeat){
      this.setState({alertMessage : '两次输入密码不一致！'});
      return ;
    }
    if(newPass.length <6 || newPass.length > 18){
      this.setState({alertMessage:'密码长度必须大于6，小于18'});
    }
    UserActions.modifyPassword({rawPassword:oldPass,newPassword:newPass});
  },
  render : function () {
    return (
      <div>
        <div className="row">
          <div className="col-xs-2">
            <label className="control-label">修改密码</label>
          </div>
        </div>
        <PasswordInput ref="oldPass" labelName="当前密码：" />
        <PasswordInput ref="newPass" labelName="新密码：" />
        <PasswordInput ref="newPassRepeat" labelName="确认密码：" />
        <Button onClick={this.handleModifyPassword}>保存</Button>
        <AlertBox alertMessage={this.state.alertMessage} />
      </div>
    );
  }
});

var ThirdPartLogin = React.createClass({
  render : function(){
    return(
      <div className="form-horizontal">
        <div className="row">
          <div className="col-xs-2">
            <label className="control-label">第三方登录</label>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-6">
            应用
          </div>
          <div className="col-xs-6">
            状态
          </div>
          <div className="col-xs-6">
            新浪微博
          </div>
          <div className="col-xs-6">
            <Button>绑定</Button>
          </div>
          <div className="col-xs-6">
            微信
          </div>
          <div className="col-xs-6">
            <Button>绑定</Button>
          </div>
        </div>
      </div>
      );
  }
});
var AccountInfo = React.createClass({

  render: function() {

    return (
      <Panel>
          <InfoHeader />
          <form className='form-horizontal'>
            <ModifyPassword />
          </form>
          <ThirdPartLogin />
      </Panel>
    );
  }
});

module.exports = AccountInfo;
