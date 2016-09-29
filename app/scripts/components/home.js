import { ROUTE_MAIN } from 'util/routeConfig'
import { Link, History } from 'react-router'

var Location = require('react-router').Location
import Reflux from 'reflux'
import React from 'react'
import moteImg from 'image/Model.png'
import photographerImg from 'image/Photographer.png'
import maImg from 'image/Dresser.png'
import bgPng from 'image/login_bg_lysb.gif'
import logoIcon from 'image/logo_icon.png'
import logoImg from 'image/logo.png'
import API from 'util/api'
import GetCodeStore from '../stores/GetCodeStore'
import GetCodeActions from '../actions/GetCodeActions'
import UserActions from '../actions/UserActions'
import UserStore from '../stores/UserStore'
import ToolTip from './toolTip'

const PhoneInput = React.createClass({
  getDefaultProps: function () {
    return ({
      des: '手机号',
    })
  },
  getInitialState: function () {
    return ({
      value: '',
    })
  },
  getValue: function () {
    return this.state.value
  },
  handleChange: function (event) {
    this.setState({ value : event.target.value })
  },
  render : function(){
    var textStyle = {
      width: '300px',
      height: '45px',
      border:'0px',
      borderBottom: '1px solid #efefef',
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
          placeholder={this.props.des}
          style={textStyle}
          onChange={this.handleChange} />
      </div>
    );
  }
});
var PasswordInput = React.createClass({
  getDefaultProps : function(){
    return ({
      placeHolder:'密码'
    })
  },
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
      border:'0px',
      borderBottom: '1px solid #efefef',
      display: 'block',
      boxSizing: 'border-box',
      background: 'rgba(0,0,0,0)',
      marginBottom : '10px',
      padding : '10px',
      color : '#8d8d8d'
    };
    return (
      <div>
        <input type="password" placeholder={this.props.placeHolder} style={textStyle} onChange={this.handleChange}/>
      </div>
    );
  }
});
//var PinInput = React.createClass({
//  getInitialState : function(){
//    return({
//      value : '',
//      codeOriginSrc : API.DOMAIN + 'temp/code',
//      codesrc : API.DOMAIN + 'temp/code'
//    });
//  },
//  getValue : function(){
//    return this.state.value;
//  },
//  handleChange : function(event){
//    this.setState({value : event.target.value});
//  },
//  reloadcode : function(event){
//    this.setState({codesrc:this.state.codeOriginSrc+'?'+new Date().getTime()})
//  },
//  render : function(){
//    var codeStyle = {
//      width: '180px',
//      height: '45px',
//      border: '1px solid #FFFFFF',
//      display: 'block',
//      boxSizing: 'border-box',
//      background: 'rgba(0,0,0,0)',
//      marginBottom : '10px',
//      padding : '10px',
//      color : '#8d8d8d',
//      float : 'left'
//    };
//    return (
//        <div>
//          <input ref="phone"
//                 type="text"
//                 value={this.state.value}
//                 placeholder="请输入图片验证码"
//                 style={codeStyle}
//                 onChange={this.handleChange} />
//          <img src={this.state.codesrc}  onClick={this.reloadcode}/>
//        </div>
//    );
//  }
//});
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
      backgroundColor : '#282828',
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
      color : '#000',
      fontSize : '11px',
    };
    var openLogin = {
      color : '#000',
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
        <div style={buttonStyle} onClick={this.props.handleLogin}>登录</div>

        <div style={openLogin}><span>还没有账号？<a onClick={this.props.toRegister}>先注册</a></span><span style={{float:'right',paddingRight:'20px'}}><a onClick={this.props.findMyPass}>忘记密码</a></span></div>
      </div>
    );
  }
});

/*
  发送验证码模块
 */
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
      border:'0px',
      borderBottom: '1px solid #efefef',
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
      border: '1px solid #efefef',
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
      backgroundColor : '#282828',
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
      color : '#000',
      fontSize : '11px',
    }
    var openLogin = {
      color : '#000',
      fontSize : '14px',
      textAlign : 'left',
      width : '300px',
      marginTop : '10px',
      marginLeft: '12px',
    }
    var regEmail = {
      float: 'right',
    }
    var imageBtn = {
      cursor: 'pointer',
    }
    if(this.props.type=='register'){
      return (
        <div>
          <span style={textStyle}>点注册表示您已阅读同意</span><Link to={'/provision'} target='_blank'><span style={ruleStyle}>《YAOPAI服务条款》</span></Link>
          <div style={buttonStyle} onClick={this.props.handleRegister}>注册</div>
          <div style={openLogin}><span>已经有账号？<a onClick={this.props.toLogin}>直接登录</a></span><span style={regEmail}>{ this.props.buttonName === '切换邮箱注册' ? <a onClick={ this.props.toEmailRegister }>切换邮箱注册</a> : <a onClick={ this.props.toTelRegister }>切换手机注册</a> }</span></div>
        </div>
      );
    }else{
      return (
        <div>
          <div style={buttonStyle} onClick={this.props.handleValidate}>提交</div>
          <div style={openLogin}><a onClick={this.props.toLogin}>直接登录</a></div>
        </div>
      );
    }
  }
});
var LoginForm = React.createClass({
  handleLogin : function(){
    var phone = this.refs.phoneInput.getValue();
    var password = this.refs.passwordInput.getValue();
    // 测试userName为手机号 /^(176|170)\d{8}$/
    // 旧的是这样的：!validator.isMobilePhone(phone, 'zh-CN')
    const rightReg = /^1(3|4|5|7|8)\d{9}$/;
    const filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if(!rightReg.test(phone)) {
      if (!filter.test(phone)) {
        this.props.handleHint('您输入邮箱或手机号格式有误')
        return
      }
    }
    //登录数据
    var loginData = {
      loginname : phone,
      password : password,
      //autologin : this.state.rememberMe, //记住我的登录需要加上
      autoexpires : 10000,
    };
    UserActions.login(loginData);
  },
  render: function() {
    var loginStyle = {
      width : '360px',
      height : '510px',
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
      marginBottom : '60px',
      marginTop:'50px',
      height: 'auto',
    }
    var inputWrap = {
      marginBottom: '15px',
    }
    return (
      <div style={loginStyle}>
        <img style={imageCenter} src={logoIcon} width="140" />
        <div style={inputWrap}>
          <PhoneInput des="手机号或邮箱" ref="phoneInput"/>
          <PasswordInput ref="passwordInput"/>
        </div>
        <LoginButtonn handleLogin={this.handleLogin} toRegister={this.props.toRegister} findMyPass={this.props.toFindPS}/>
      </div>
    );
  }
});


// 找回密码
var FindMyPass = React.createClass({
  mixins: [Reflux.listenTo(UserStore, 'handleResetResult')],
  handleGetCode : function(){
    const emailPhone = this.refs.phoneInput.getValue();
    const telReg = /^1(3|4|5|7|8)\d{9}$/
    const mailReg  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
    if (telReg.test(emailPhone)){
      GetCodeActions.sendTelResetPassWord({tel:emailPhone});
      alert('验证码已发送,请查收')
    } else if(mailReg.test(emailPhone)) {
      GetCodeActions.sendMailResetPassWord({email:emailPhone});
      alert('验证码已发送,请查收')
    } else {
      this.props.handleHint('手机号或邮箱格式错误')
      return
    }
  },
  handleValidate : function(){
    var emailPhone = this.refs.phoneInput.getValue();
    var code = this.refs.codeInput.getValue();
    var password = this.refs.passwordInput.getValue();
    var repassword = this.refs.repasswordInput.getValue();
    if(!password){
      this.props.handleHint('请输入密码');
      return;
    }
    if(!repassword){
      this.props.handleHint('请再次输入密码');
      return;
    }
    if(password!==repassword){
      this.props.handleHint('两次输入的密码不一致');
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
    var resetData = {}
    const telReg = /^1(3|4|5|7|8)\d{9}$/
    const mailReg  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
    if (telReg.test(emailPhone)){
      resetData = {tel: emailPhone, password: password, code: code}
      UserActions.receiveTelResetPassWord(resetData)
    } else if(mailReg.test(emailPhone)) {
      resetData = {email: emailPhone, password: password, code: code}
      UserActions.receiveMailResetPassWord(resetData)
    } else {
      this.props.handleHint('手机号或邮箱格式错误')
      return
    }
  },
  handleResetResult : function(data){
    if(data.hintMessage){
      this.props.handleHint(data.hintMessage);
    }else{
      this.props.handleHint('注册成功，请登录！');
      this.props.toLogin();
    }
  },
  render : function(){
    var registerStyle = {
      width : '360px',
      height : '510px',
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
      marginBottom : '20px',
      marginTop:'50px',
      height: 'auto',
    };
    var inputWrap = {
      marginBottom: '15px',
    }
    return (
      <div style={registerStyle}>
        <img style={imageCenter} src={logoIcon} width='140'/>
        <div style={inputWrap}>
          <PhoneInput des="手机号或邮箱" ref="phoneInput"/>
          <ValidateCodeInput ref="codeInput" handleGetCode = {this.handleGetCode} handleHint = {this.props.handleHint}/>
          <PasswordInput placeHolder="输入新密码" ref="passwordInput"/>
          <PasswordInput placeHolder="再次输入密码" ref="repasswordInput"/>
        </div>
        <RegisterButtons handleValidate={this.handleValidate} toLogin={this.props.toLogin} />
      </div>
    );
  }
});

var RegisterForm = React.createClass({
  mixins: [Reflux.listenTo(UserStore, 'handleRegisterResult')],
  handleGetCode : function(){
    var phone = this.refs.phoneInput.getValue();
    // 测试userName为手机号 /^(176|170)\d{8}$/
    // 旧的是这样的：!validator.isMobilePhone(phone, 'zh-CN')
    const rightReg = /^1(3|4|5|7|8)\d{9}$/;
    if(!rightReg.test(phone)) {
      this.props.handleHint('请输入正确的手机号码');
      return;
    } else{
      GetCodeActions.sendTelRegister({tel:phone});
    }
  },
  handleRegister : function(){
    var phone = this.refs.phoneInput.getValue();
    var code = this.refs.codeInput.getValue();
    var password = this.refs.passwordInput.getValue();
    const rightReg = /^1(3|4|5|7|8)\d{9}$/;
    var isMobile = rightReg.test(phone);

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
      marginBottom : '20px',
      marginTop:'50px',
      height: 'auto',
    };
    var inputWrap = {
      marginBottom: '15px',
    }
    return (
      <div style={registerStyle}>
        <img style={imageCenter} src={logoIcon} width='140'/>
        <div style={inputWrap}>
          <PhoneInput ref="phoneInput"/>
          <PasswordInput ref="passwordInput"/>
          <ValidateCodeInput ref="codeInput" handleGetCode = {this.handleGetCode} handleHint = {this.props.handleHint}/>
        </div>
        <RegisterButtons buttonName="切换邮箱注册" handleRegister={this.handleRegister} toLogin={this.props.toLogin} toEmailRegister={this.props.toEmailRegister} />
      </div>
    );
  }
});

var EmailRegisterForm = React.createClass({
  mixins: [Reflux.listenTo(UserStore, 'handleRegisterResult')],

  handleGetCode : function(){
    var email = this.refs.phoneInput.getValue();
    var filter  = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!filter.test(email)){
      this.props.handleHint('请输入正确格式的邮箱')
      return
    } else {
      GetCodeActions.sendEmailRegister({email:email});
    }
  },

  handleRegister : function(){
    var email = this.refs.phoneInput.getValue();
    var code = this.refs.codeInput.getValue();
    var password = this.refs.passwordInput.getValue();
    if(!email){
      this.props.handleHint('请输入邮箱');
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
    var registerData = {email : email,password : password,code : code};
    UserActions.emailRegister(registerData);
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
      marginBottom : '20px',
      marginTop:'50px',
      height: 'auto',
    };
    var inputWrap = {
      marginBottom: '15px',
    }
    return (
      <div style={registerStyle}>
        <img style={imageCenter} src={logoIcon} width='140'/>
        <div style={inputWrap}>
          <PhoneInput des="邮箱" ref="phoneInput"/>
          <PasswordInput ref="passwordInput"/>
          <ValidateCodeInput ref="codeInput" handleGetCode = {this.handleGetCode} handleHint = {this.props.handleHint}/>
        </div>
        <RegisterButtons toTelRegister={this.props.toTelRegister} buttonName="切换手机注册" handleRegister={this.handleRegister} toLogin={this.props.toLogin}/>
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
        // 登录成功，需要获取当前用户
        UserActions.currentUser()
      }
    }
    if(data.flag == 'currentUser'){
      if(data.hintMessage){
        this.handleHint(data.hintMessage);
      }else{
        if(data.isLogin){
          //获取当前用户成功，跳转至指定界面
          if(this.props.location.state && this.props.location.state.nextpage){
            this.history.replaceState(null,this.props.location.state.nextpage);
          }else{
            this.history.replaceState(null, ROUTE_MAIN);
          }
        }
      }
    }
  },
  getInitialState : function(){
    return{
      show : 'login',
      display : 'none',
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
  showEmailRegister : function(){
    this.setState({show : 'emailRegister'});
    return false;
  },
  showFindPS: function(){
    this.setState({show: 'findMyPass'})
  },
  hidden : function(){
    this.setState({ display : 'none' });
  },
  show : function(e){
    this.setState({ display : 'block' });
  },
  auth : function(){
  },

  render : function(){
    var bgStyle = {
      width : '100%',
      height : '100%',
      background : `url(${bgPng}) no-repeat center center`,
      backgroundColor : '#777777',
      backgroundSize : 'cover',
      position: 'absolute',
      top: '0',
      left: '0',
    };
    var container = {
      width : '1120px',
      margin : '0px auto'
    };
    var footerStyle = {
      width : '100%',
      background : 'rgba(0,0,0,.5)',
      position : 'absolute',
      bottom : '0px',
      height : '80px'
    };
    var mask = {
      background : 'rgba(0,0,0,.7)',
      position : 'fixed',
      height : '100%',
      width : '100%',
      zIndex : '999',
      display : this.state.display,
    };
    var form = {
      background : '#fff',
      width:'360px',
      height:'500px',
      position:'absolute',
      top:'50%',
      marginTop:'-250px',
      left:'50%',
      marginLeft:'-180px',
      borderRadius:'10px',
      zIndex:'1000',
      display: this.state.display,
    }

    var mainFrame ;


    if(this.state.show == 'register'){
      mainFrame = (
        <RegisterForm handleHint={this.handleHint} toLogin={this.showLogin} toEmailRegister={this.showEmailRegister} />
      );
    }else if(this.state.show == 'login'){
      mainFrame = (
        <LoginForm handleHint={this.handleHint} toRegister={this.showRegister} toFindPS={this.showFindPS} />
      );
    }else if(this.state.show=='findMyPass'){
      mainFrame = (
        <FindMyPass handleHint={this.handleHint} toLogin={this.showLogin} />
      );
    }else{
      mainFrame = (
        <EmailRegisterForm toTelRegister={ this.showRegister } handleHint={this.handleHint} toLogin={this.showLogin} toEmailRegister={this.showEmailRegister} />
      );
    }
    return (
      <div style={bgStyle}>
        <div ref="forms" style={ form }>
          {mainFrame}
        </div>
        <div onClick={this.hidden} ref="mask" style={mask}></div>
        <div style={container}>
          <div>
            <div style={{padding:'30px 0',color:'#fff'}}>
              <a >
                <img src={logoImg} width="250" alt=""/>
              </a>
              <a style={{
              float:'right',
              border:'1px solid #fff',
              padding:'5px 10px',
              borderRadius:'20px',
              color:'#fff'}} onClick={this.show}>登录 | 注册</a>
            </div>
          </div>
          <div style={{display:'flex',marginTop:'50px'}}>
            <div style={{flex:1}}><img src={photographerImg} draggable="false" width="350" alt=""/></div>
            <div style={{flex:1}}><img src={moteImg} draggable="false" width="350" alt=""/></div>
            <div style={{flex:1}}><img src={maImg} draggable="false" width="350" alt=""/></div>
          </div>
        </div>
        <ToolTip ref="toolTip" title=""></ToolTip>
      </div>
    );
  }
});

module.exports = Home;
