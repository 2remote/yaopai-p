var React = require('react');
var Panel = require('react-bootstrap').Panel;
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;

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
  render : function(){
    return (
      <Input type="password" 
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
  render : function () {
    return (
      <div>
        <div className="row">
          <div className="col-xs-2">
            <label className="control-label">修改密码</label>
          </div>
        </div>
        <PasswordInput labelName="当前密码：" />
        <PasswordInput labelName="新密码：" />
        <PasswordInput labelName="确认密码：" />
        <Button>保存</Button>
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
