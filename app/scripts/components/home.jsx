var React = require('react');
var IndexCover = require('./indexCover');

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
        <LoginForm />
      </div>
    );
  }
});

module.exports = Home;
