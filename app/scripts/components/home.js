var React = require('react');
var Location = require('react-router').Location;
var validator = require('validator');
var Reflux = require('reflux');
var GetCodeStore = require('../stores/GetCodeStore');
var GetCodeActions = require('../actions/GetCodeActions');
var UserActions = require('../actions/UserActions');
var UserStore = require('../stores/UserStore');
var IndexCover = require('./indexCover');
var ToolTip = require('./toolTip');
var API = require('../api');
var Provision = require('./provision');
import { ROUTE_MAIN } from '../routeConfig'
import { Link, History } from 'react-router'

var PhoneInput = React.createClass({
  getInitialState : function(){
    return({
      value : '',
    });
  },
  getValue : function(){
    return this.state.value;
  },
  handleChange : function(event){
    this.setState({value : event.target.value});
  },
  render : function(){
    var textStyle = {
      width: '300px',
      height: '45px',
      border: '1px solid #FFFFFF',
      display: 'block',
      boxSizing: 'border-box',
      background: 'rgba(0,0,0,0)',
      marginBottom : '10px',
      padding : '10px',
      color : '#8d8d8d'
    };
    return (
      <div>
        <input ref="phone"
          type="text"
          value={this.state.value}
          placeholder="请输入您的手机号"
          style={textStyle}
          onChange={this.handleChange} />
      </div>
    );
  }
});
var PasswordInput = React.createClass({
  getInitialState : function(){
    return({
      value : '',
    });
  },
  handleChange : function(event){
    this.setState({value : event.target.value});
  },
  getValue : function(){
    return this.state.value;
  },
  render : function(){
    var textStyle = {
      width: '300px',
      height: '45px',
      border: '1px solid #FFFFFF',
      display: 'block',
      boxSizing: 'border-box',
      background: 'rgba(0,0,0,0)',
      marginBottom : '10px',
      padding : '10px',
      color : '#8d8d8d'
    };
    return (
      <div>
        <input type="password" placeholder="请输入您的密码" style={textStyle} onChange={this.handleChange}/>
      </div>
    );
  }
});
var PinInput = React.createClass({
  getInitialState : function(){
    return({
      value : '',
      codeOriginSrc : API.DOMAIN + 'temp/code',
      codesrc : API.DOMAIN + 'temp/code'
    });
  },
  getValue : function(){
    return this.state.value;
  },
  handleChange : function(event){
    this.setState({value : event.target.value});
  },
  reloadcode : function(event){
    this.setState({codesrc:this.state.codeOriginSrc+'?'+new Date().getTime()})
  },
  render : function(){
    var codeStyle = {
      width: '180px',
      height: '45px',
      border: '1px solid #FFFFFF',
      display: 'block',
      boxSizing: 'border-box',
      background: 'rgba(0,0,0,0)',
      marginBottom : '10px',
      padding : '10px',
      color : '#8d8d8d',
      float : 'left'
    };
    return (
        <div>
          <input ref="phone"
                 type="text"
                 value={this.state.value}
                 placeholder="请输入图片验证码"
                 style={codeStyle}
                 onChange={this.handleChange} />
          <img src={this.state.codesrc}  onClick={this.reloadcode}/>
        </div>
    );
  }
});
var LoginButtonn = React.createClass({
  openLogin : function(){
    UserActions.openLogin();
  },
  forgotPass : function(){
    window.open('http://m.aiyaopai.com/#/findByMobileForm','','width=400,height=300');
  },
  render : function(){
    var buttonStyle = {
      width : '300px',
      height : '45px',
      backgroundColor : '#3F7BB4',
      color: '#fff',
      fontSize: '20px',
      textAlign : 'center',
      paddingTop : '10px',
      cursor : 'pointer',
      marginBottom: '26px'
    };
    var textStyle ={
      color : '#8d8d8d',
      fontSize : '11px',
      lineHeight: '20px',
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
      marginLeft: '12px',
    };
    var imageBtn = {
      cursor : 'pointer',
    };
    return (
      <div>
        <span style={textStyle}>点登录表示您已阅读同意</span><Link to={'/provision'} target='_blank'><span style={ruleStyle}>《YAOPAI服务条款》</span></Link>
        <div style={buttonStyle} onClick={this.props.handleLogin}>登录</div>

        <div style={openLogin}><span>还没有账号？<a href="#" onClick={this.props.toRegister}>先注册</a></span><span style={{float:'right',paddingRight:'20px'}}><a onClick={this.forgotPass}>忘记密码</a></span></div>
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
  componentDidUpdate : function () {
    if(this.state.getCode.left == 0 && this.state.getCode.result){
      this.props.handleHint(this.state.getCode.result);
      //this.props.pinReload();
    }
  },
  handleChange : function(event){
    this.setState({value : event.target.value});
  },
  getValue : function(){
    return this.state.value;
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
      background: 'rgba(0,0,0,0)',
      marginBottom : '10px',
      padding : '10px',
      color : '#8d8d8d',
      float : 'left'
    };
    var codeBtnStyle = {
      width : '120px',
      height : '45px',
      border: '1px solid #FFFFFF',
      display: 'block',
      boxSizing: 'border-box',
      background: 'rgba(0,0,0,0)',
      marginBottom : '10px',
      padding : '5px',
      color : '#8d8d8d',
      float : 'left',
      cursor : 'pointer',
      lineHeight: '33px',
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
      <div className="clearfix">
        <input type="text"
          placeholder="输入验证码"
          onChange={this.handleChange} style={codeStyle}/>
        {getCodeButton}
      </div>
    );
  }
});
var RegisterButtons = React.createClass({
  handleReg: function () {
    this.props.handleReg();
  },
  openLogin : function(){
    UserActions.openLogin();
  },
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
      marginBottom: '26px',
    };
    var textStyle ={
      color : '#8d8d8d',
      fontSize : '11px',
      lineHeight: '20px',
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
      marginLeft: '12px',
    };
    var imageBtn = {
      cursor : 'pointer'
    }
    return (
      <div>
        <span style={textStyle}>点注册表示您已阅读同意</span><Link to={'/provision'} target='_blank'><span style={ruleStyle}>《YAOPAI服务条款》</span></Link>
        <div style={buttonStyle} onClick={this.props.handleRegister}>注册</div>

        <div style={openLogin}><span>已经有账号？<a href="#" onClick={this.props.toLogin}>直接登录</a></span></div>
      </div>
    );
  }
});
var LoginForm = React.createClass({
  handleLogin : function(){
    var phone = this.refs.phoneInput.getValue();
    var password = this.refs.passwordInput.getValue();
    // 测试userName为手机号 /^(176|170)\d{8}$/
    // 旧的是这样的：!validator.isMobilePhone(phone, 'zh-CN')
    const rightReg = /^1(3|4|5|7|8)\d{9}$/;
    if(!rightReg.test(phone) || !validator.isLength(password,6,18)) {
      this.props.handleHint('请输入正确的手机号码和密码格式');
      return;
    }
    //登录数据
    var loginData = {
      loginname : phone,
      password : password,
      //autologin : this.state.rememberMe, //记住我的登录需要加上
      autoexpires : 10000
    };
    UserActions.login(loginData);
  },
  render: function() {
    var loginStyle = {
      width : '360px',
      height : '510px',
      background: 'rgba(0,0,0,0.6)',
      margin : '0 auto',
      padding : '40px 30px 14px',
      position : 'relative',
      top: '45%',
      left: '50%',
      marginLeft: '-180px',
      marginTop: '-230px',
      textAlign: 'center',
    };
    var imageCenter = {
      margin : '0px auto',
      marginBottom : '46px',
      width: '100%',
      height: 'auto',
    }
    var inputWrap = {
      marginBottom: '15px',
    }
    return (
      <div style={loginStyle}>
        <img style={imageCenter} src="img/logo3.png" />
        <div style={inputWrap}>
          <PhoneInput ref="phoneInput"/>
          <PasswordInput ref="passwordInput"/>
        </div>
        <LoginButtonn handleLogin={this.handleLogin} toRegister={this.props.toRegister}/>
      </div>
    );
  }
});

var RegisterForm = React.createClass({
  mixins: [Reflux.listenTo(UserStore, 'handleRegisterResult')],
  handleGetCode : function(){
    var phone = this.refs.phoneInput.getValue();
    var isMobile;
    //手机号码是170号段暂不验证
    if(phone.substr(0,3)=='170') {
      GetCodeActions.sendTelRegister({tel:phone});
    } else {
      isMobile = validator.isMobilePhone(phone,'zh-CN')
      if(isMobile> 0){
        GetCodeActions.sendTelRegister({tel:phone});
      }else if(phone.length == 0){
        this.props.handleHint('请输入手机号码');
      }else{
        this.props.handleHint('请输入正确的手机号码');
      }
    }
  },
  handleRegister : function(){
    var phone = this.refs.phoneInput.getValue();
    var code = this.refs.codeInput.getValue();
    var password = this.refs.passwordInput.getValue();
    var isMobile = validator.isMobilePhone(phone,'zh-CN');
    if(!isMobile){
      this.props.handleHint('请输入正确的手机号码');
      return;
    }
    if(!password){
      this.props.handleHint('请输入密码');
      return;
    }
    if(password.length < 6 || password.length > 18){
      this.props.handleHint('密码长度应在6-18之间');
      return;
    }
    if(!code){
      this.props.handleHint('请输入验证码');
      return;
    }
    if(code.length != 4){
      this.props.handleHint('请输入4位验证码');
    }
    var registerData = {tel : phone,password : password,code : code};
    UserActions.register(registerData);
  },
  handleRegisterResult : function(data){
    if(data.flag == 'register'){
      if(data.hintMessage){
        this.props.handleHint(data.hintMessage);
      }else{
        this.props.handleHint('注册成功，请登录！');
        this.props.toLogin();
      }
    }
  },
  render : function(){
    var registerStyle = {
      width : '360px',
      height : '510px',
      background: 'rgba(0,0,0,0.6)',
      margin : '0 auto',
      padding : '40px 30px 14px',
      position : 'relative',
      top: '45%',
      left: '50%',
      marginLeft: '-180px',
      marginTop: '-230px',
      textAlign: 'center',
    };
    var imageCenter = {
      margin : '0px auto',
      marginBottom : '46px',
    };
    var inputWrap = {
      marginBottom: '15px',
    }
    return (
      <div style={registerStyle}>
        <img style={imageCenter} src="img/logo3.png" width='280' height='75'/>
        <div style={inputWrap}>
          <PhoneInput ref="phoneInput"/>
          <PasswordInput ref="passwordInput"/>
          <ValidateCodeInput ref="codeInput" handleGetCode = {this.handleGetCode} handleHint = {this.props.handleHint}/>
        </div>
        <RegisterButtons handleRegister={this.handleRegister} toLogin={this.props.toLogin}/>
      </div>
    );
  }
});

var Home = React.createClass({
  mixins: [Reflux.listenTo(UserStore, 'handleLoginResult'),History,Location],
  handleLoginResult : function(data){
    if(data.flag == 'login'){
      if(data.hintMessage){
        this.handleHint(data.hintMessage);
      }else{
        //登录成功，需要获取当前用户
        UserActions.currentUser();
      }
    }
    if(data.flag == 'currentUser'){
      if(data.hintMessage){
        this.handleHint(data.hintMessage);
      }else{
        if(data.isLogin){
          //获取当前用户成功，跳转至指定界面
          if(this.props.location.state && this.props.location.state.nextpage)
            this.history.replaceState(null,this.props.location.state.nextpage);
          else
            this.history.replaceState(null, ROUTE_MAIN);
        }
      }
    }
  },
  getInitialState : function(){
    return{
      show : 'login',
    }
  },
  componentDidMount : function(){
    UserActions.currentUser();
  },
  handleHint: function (title) {
    this.refs.toolTip.toShow(title);
  },
  showLogin : function(){
    this.setState({show : 'login'});
    return false;
  },
  showRegister : function(){
    this.setState({show : 'register'});
    return false;
  },
  render : function(){
    var bgStyle = {
      width : '100%',
      height : '100%',
      background : 'url(img/background1.jpg) no-repeat center center',
      backgroundColor : '#777777',
      backgroundSize : 'cover',
      position: 'fixed',
      top: '0',
      left: '0',
    };
    var mainFrame ;
    if(this.state.show == 'register'){
      mainFrame = (
        <RegisterForm handleHint={this.handleHint} toLogin={this.showLogin}/>
      );
    }else{
      mainFrame = (
        <LoginForm handleHint={this.handleHint} toRegister={this.showRegister}/>
      );
    }
    return (
      <div style={bgStyle}>
        <ToolTip ref="toolTip" title=""></ToolTip>
        {mainFrame}
      </div>
    );
  }
});

module.exports = Home;
