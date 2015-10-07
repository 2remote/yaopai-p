var React = require('react');
var Router = require('react-router');
var Link  = Router.Link;
var Reflux = require('reflux');

var validator = require('validator');
var UserActions = require('../actions/UserActions');
var UserStore = require('../stores/UserStore');

var GetCodeActions = require('../actions/GetCodeActions');
var GetCodeStore = require('../stores/GetCodeStore');


var UserNameInput = require('./user/userNameInput');
var UserPasswordInput = require('./user/userPasswordInput');
var IndexCover = require('./indexCover');
var Modal = require('react-bootstrap').Modal;

var AlertBox = require('./user/alertBox');
var RegisterButton = React.createClass({

	render : function(){
		return (
			<div className="form-group">
    			<div className="col-sm-offset-2 col-sm-6">
    				<div className="col-sm-5">
						<button className="btn btn-primary " onClick={this.props.handleClick}>注册新用户</button>
					</div>
					<div className="col-sm-4">
						<button className="btn btn-success " onClick={this.props.toLogin}>已有账户?</button>
					</div>
				</div>

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
		if(this.state.getCode.left > 0){
			getCodeButton = (
				<button className="btn btn-default" type="button" disabled="disabled" >获取验证码({this.state.getCode.left})</button>
				);
		}else{
			getCodeButton = (
				<button className="btn btn-default" type="button" onClick={this.props.handleGetCode} >获取验证码</button>
				)
		}
		return(
			<div className={classString}>
				<div className="col-sm-offset-2 col-sm-6 ">
					<div className="input-group">
						<input type="text" 
							className="form-control" 
							placeholder="输入验证码" 
							onChange={this.props.handleChange}/>
						<span className="input-group-btn">
			        {getCodeButton}
			      </span>
					</div>
					<span>{this.state.getCode.result}</span>
				</div>
				<label className="control-label col-sm-4">{this.state.message}</label>
			</div>
		);
	}
});

var RegisterForm = React.createClass({
	mixins: [Reflux.listenTo(UserStore, 'handleRegister')],
	getInitialState : function(){
		return {
			userName : '',
			password : '',
			validateCode : '',
			rememberMe : false,
			alertMessage : ''
		}
	},
	getValidatedClass : function(validated){
		var classString = 'form-group'
		switch(validated){
			case '0' :
				break;
			case '1' :
				classString = classString + ' has-success';
				break;
			case '2' :
				classString = classString + ' has-warning';
				break;
		}
		return classString;
	},
	handleUserNameChange : function(event){
		this.setState({userName:event.target.value});
	},
	handlePasswordChange : function(event){
		this.setState({password:event.target.value});
	},
	handleCheckedChange : function(event){
		this.setState({rememberMe : event.target.checked});
	},
	handleCodeChange : function(event){
		this.setState({validateCode : event.target.value});
	},
	handleRegister : function(data){
		if(data.hintMessage == ''){
			//注册成功,暂时跳转登录页面
			this.props.finishRegister();
		}else{
			this.setState({alertMessage:data.hintMessage});
		}
		
	},
	handleClick : function(){
		var isMobile = validator.isMobilePhone(this.state.userName, 'zh-CN');
		var isPassword = validator.isLength(this.state.password,6,18);
		var isValidedCode = this.state.validateCode && this.state.validateCode !='';
		if(!isMobile || !isPassword) {
			this.setState({alertMessage:'请输入正确的手机号码和密码格式'});
			return;
		}
		if(!isValidedCode){
			this.setState({alertMessage:'请输入验证码'})
		}
		var registerData = {tel : this.state.userName,password : this.state.password,code : this.state.validateCode};
		UserActions.register(registerData);
	},
	//发送验证码
	handleGetCode : function(){
		var phone = this.state.userName;
		var isMobile = validator.isMobilePhone(this.state.userName, 'zh-CN');
		if(!isMobile){
			this.setState({alertMessage:'请输入正确的手机号码'});
			return;	
		}
		GetCodeActions.sendTelRegister({tel:phone});
	},
	/*
		校验表现css
	*/
	getValidatedClass : function(validated){
		var classString = 'form-group'
		switch(validated){
			case '0' :
				break;
			case '1' :
				classString = classString + ' has-success';
				break;
			case '2' :
				classString = classString + ' has-warning';
				break;
		}
		return classString;
	},

	render : function(){
		return(
			<div className="panel-body">
				<form className="form-horizontal">

						<UserNameInput 
							userName = {this.state.userName} 
							handleChange={this.handleUserNameChange} 
							validatedClass={this.getValidatedClass}/>

						<UserPasswordInput 
	        		password = {this.state.password} 
	        		handleChange={this.handlePasswordChange} 
	        		validatedClass={this.getValidatedClass}/>

	        	<ValidateCodeInput 
	        		handleGetCode={this.handleGetCode} 
	        		handleChange={this.handleCodeChange}/>

	        	<RegisterButton handleClick={this.handleClick}
	        		validatedClass={this.getValidatedClass} 
	        		toLogin={this.props.toLogin}/>
	        	<AlertBox alertMessage={this.state.alertMessage} />
				</form>
			</div>
		);
	}
});

var RegisterPanel = React.createClass({
	getInitialState : function() {
    return { showModal: false };
  },
  close : function() {
    this.setState({ showModal: false });
  },

  open : function() {
    this.setState({ showModal: true });
  },
  render: function() {

    return (
	    	<Modal show={this.state.showModal} onHide={this.close}>
	    		<Modal.Header closeButton>
	    			注册成为YAOPAI的用户，发现你的不同
	    		</Modal.Header>
	    		<Modal.Body>
	      		<RegisterForm toLogin={this.props.login} finishRegister={this.props.login}/>
	      	</Modal.Body>
	      </Modal>
    );
  }
});

module.exports = RegisterPanel;
