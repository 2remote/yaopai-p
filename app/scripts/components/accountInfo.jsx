var React = require('react');
var Panel = require('react-bootstrap').Panel;
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;

var InfoHeader = React.createClass({
  render : function(){
    var style = {
      headerInfo: {
        fontSize: '22px',
        color: '#777777',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: '#e8e8e8',
        marginBottom: '50px',
      },
      title: {
        paddingLeft: '20px',
      }
    };
    return (
      <div style={style.headerInfo} className="header-info">
        <span className="glyphicon glyphicon-user" aria-hidden="true"></span>
        <span style={style.title} className="title">账户信息</span>
      </div>
    );
  }
});

var UserPhone = React.createClass({
  render: function () {
    var style = {
      labelWrap: {
        textAlign: 'right',
      },
    }
    return (
      <div className="form-group">
        <div className="col-xs-2" style={style.labelWrap}>
          <span className="glyphicon glyphicon-earphone" aria-hidden="true"></span>
          <label className="control-label">个人手机</label>
        </div>
        <div className="col-xs-4">
          <input className="form-control" />
        </div>
      </div>
    );
  }
});

var PasswordInput = React.createClass({
  getDefaultProps : function(){
    return{
      textClassName : 'col-sm-4',
      validatedClass : '',
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
    var style = {
      labelWrap: {
        textAlign: 'right',
      },
    }
    return (
      <div>
        <div className="form-group">
          <div className="col-xs-2" style={style.labelWrap}>
            <span className="glyphicon glyphicon-lock" aria-hidden="true"></span>
            <label className="control-label">修改密码</label>
          </div>
        </div>
        <PasswordInput labelName="当前密码" />
        <PasswordInput labelName="新密码" />
        <PasswordInput labelName="确认密码" />
        <Button bsStyle="primary" className="col-xs-offset-3">保存</Button>
      </div>
      );
  }
});

var ThirdPartLogin = React.createClass({
  render : function(){
    var style = {
      title: {
        marginBottom: '40px',
      },
      words: {
        paddingLeft: '100px',
      },
      /*按钮等宽*/
      commonButton: {
        width: '100px',
      },
      removeButton: {
        width: '100px',
        backgroundColor: '#777777',
        color: '#fff',
        marginRight: '15px',
      },
      lineH: {
        lineHeight: '50px',
        height: '50px',
      }
    };
    return(
      <div className="form-group">
        <div className="row" style={style.title}>
          <div className="col-xs-2">
            <span className="glyphicon glyphicon-user" aria-hidden="true"></span>
            <label className="control-label">第三方登录</label>
          </div>
        </div>
        <div className="row">
          <div className="col-xs-6" style={style.words}>
            <h5>应用</h5>
            <p style={style.lineH}>新浪微博</p>
            <p style={style.lineH}>微信</p>
          </div>
          <div className="col-xs-6">
            <h5>状态</h5>
            <p style={style.lineH}>
              <Button style={style.removeButton}>已绑定</Button>
              <Button bsStyle="danger" style={style.commonButton}>解绑</Button>
            </p>
            <p style={style.lineH}>
              <Button bsStyle="primary" style={style.commonButton}>绑定</Button>
            </p>
          </div>
        </div>
      </div>
    );
  }
});
var AccountInfo = React.createClass({

  render: function() {
    var style = {
      outer: {
        backgroundColor: '#fff',
        paddingTop: '40px',
        paddingLeft: '60px',
        paddingBottom: '70px',
      },
    };
    return (
      <div style={style.outer}>
        <InfoHeader />
        <form className='form-horizontal'>
          <UserPhone />
          <ModifyPassword />
          <ThirdPartLogin />
        </form>
      </div>
      // <Panel>
      //     <InfoHeader />
      //     <form className='form-horizontal'>
      //       <ModifyPassword />
      //     </form>
      //     <ThirdPartLogin />
      // </Panel>
    );
  }
});

module.exports = AccountInfo;
