var React = require('react');
var IndexCover = require('./indexCover');

var Reflux = require('reflux');
var GetCodeStore = require('../stores/GetCodeStore');
var GetCodeActions = require('../actions/GetCodeActions');

var PhoneInput = React.createClass({
  render : function(){
    var textStyle = {
      width: '300px',
      height: '45px',
      border: '1px solid #FFFFFF',
      display: 'block',
      boxSizing: 'border-box',
      background: 'rgba(0,0,0,0.5)',
      opacity : '0.5',
      marginBottom : '10px',
      padding : '5px',
      color : '#fff'
    };
    return (
      <div>
        <input type="text" placeholder="请输入您的手机号" style={textStyle}/>
      </div>
    );
  }
});
var PasswordInput = React.createClass({
  render : function(){
    var textStyle = {
      width: '300px',
      height: '45px',
      border: '1px solid #FFFFFF',
      display: 'block',
      boxSizing: 'border-box',
      background: 'rgba(0,0,0,0.5)',
      opacity : '0.5',
      marginBottom : '10px',
      padding : '5px',
      color : '#fff'
    };
    return (
      <div>
        <input type="password" placeholder="请输入您的密码" style={textStyle}/>
      </div>
    );
  }
});
var LoginButtonn = React.createClass({
  render : function(){
    var buttonStyle = {
      width : '300px',
      height : '45px',
      backgroundColor : '#3F7BB4',
      color: '#fff',
      fontSize: '20px',
      textAlign : 'center',
      paddingTop : '10px;',
      cursor : 'pointer',
    };
    var textStyle ={
      color : '#8d8d8d',
      fontSize : '11px',
    };
    var ruleStyle ={
      color : '#fff',
      fontSize : '11px',
    };
    var openLogin = {
      color : '#fff',
      fontSize : '14px',
      textAlign : 'left',
      width : '300px',
      marginTop : '10px',
    }
    return (
      <div>
        <span style={textStyle}>点登录表示您已阅读同意</span><span style={ruleStyle}>《YAOPAI服务条款》</span>
        <div style={buttonStyle}>登录</div>
        <div style={openLogin}><span>社交账号直接登录</span><img src="img/wechat.png" /></div>
        <div style={openLogin}><span>还没有账号？先注册</span></div>
      </div>
    );
  }
});

var ValidateCodeInput = React.createClass({
  mixins: [Reflux.listenTo(GetCodeStore, 'handleResult')],
  getInitialState : function(){
    return{
      validated : '0',
      getCode : {left : 0 , result : ''} ,
    }
  },
  getDefaultProps : function(){
    return {
      validatedClass : function(){
        return 'form-group';
      },
      code : ''
    }
  },
  handleResult : function(){
    this.setState({getCode : GetCodeStore.getCode});
  },
  render : function(){
    var classString = this.props.validatedClass(this.state.validated);
    var getCodeButton ;
    var codeStyle = {
      width: '180px',
      height: '45px',
      border: '1px solid #FFFFFF',
      display: 'block',
      boxSizing: 'border-box',
      background: 'rgba(0,0,0,0.5)',
      opacity : '0.5',
      marginBottom : '10px',
      padding : '5px',
      color : '#fff'
    };
    var codeBtnStyle = {

    };
    if(this.state.getCode.left > 0){
      getCodeButton = (
        <div style={codeBtnStyle}>获取验证码({this.state.getCode.left})</div>
        );
    }else{
      getCodeButton = (
        <div style={codeBtnStyle} onClick={this.props.handleGetCode} >获取验证码</div>
        )
    }
    return(
      <div>
        <input type="text" 
          placeholder="输入验证码" 
          onChange={this.props.handleChange} style={codeStyle}/>
        {getCodeButton}
      </div>
    );
  }
});

var LoginForm = React.createClass({

  render: function() {
    var loginStyle = {
      width : '368px',
      height : '560px',
      background: 'rgba(0,0,0,0.7)',
      margin : '0 auto',
      padding : '30px',
      position : 'relative',
      top : '100px',
      textAlign: 'center',
    };
    var imageCenter = {
      margin : '0px auto',
      marginBottom : '10px',
      opacity : '0.7'
    }
    return (
      <div style={loginStyle}>
        <img style={imageCenter} src="img/logo1.png" />
        <img style={imageCenter} src="img/logo2.png" />
        <PhoneInput />
        <PasswordInput />
        <LoginButtonn />
      </div>
    );
  }
});

var RegisterForm = React.createClass({
  render : function(){
    var registerStyle = {
      width : '368px',
      height : '560px',
      background: 'rgba(0,0,0,0.7)',
      margin : '0 auto',
      padding : '30px',
      position : 'relative',
      top : '100px',
      textAlign: 'center',
    };
    var imageCenter = {
      margin : '0px auto',
      marginBottom : '10px',
      opacity : '0.7'
    }
    return (
      <div style={registerStyle}>
        <img style={imageCenter} src="img/logo1.png" />
        <img style={imageCenter} src="img/logo2.png" />
        <PhoneInput />
        <PasswordInput />
        <ValidateCodeInput />
      </div>
    );
  }
});

var Home = React.createClass({
  render : function(){
    var bgStyle = {
      width : '100%',
      height : '100%',
      background : 'url(img/background1.jpg) no-repeat center center fixed',
      backgroundColor : '#777777',
      backgroundSize : 'cover',
    };
    return (
      <div style={bgStyle}>
        <RegisterForm />
      </div>
    );
  }
});

module.exports = Home;
