var React = require('react');
var Router = require('react-router');
var Link  = Router.Link;
var Reflux = require('reflux');
var UserStore = require('../stores/UserStore');

var validator = require('validator');
var UserActions = require('../actions/UserActions');


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


var UserPasswordRepeatInput = React.createClass({
	getInitialState : function(){
    return {
      repeatPassword : '',
      message : '',
      validated : '0'
    };
  },
  getDefaultProps : function(){
  	return {
  		originPassword : '',
  		validatedClass : function(validated){
  			return 'form-control';
  		}
  	}
  },
  handleChange : function(event){
  	if(this.props.originPassword != event.target.value){
  		this.setState({repeatPassword : event.target.value,message : '两次密码输入不一致',validated : '2'})
  	}else{
  		this.setState({repeatPassword : event.target.value,message : '', validated : '1'})
  	}
  },
	render : function(){
		var classString = this.props.validatedClass(this.state.validated);
		return(
			<div className={classString}>
				<div className="col-sm-offset-2 col-sm-6">
					<input type="password" 
						className="form-control" 
						placeholder="再输入一次密码" 
						onChange={this.handleChange}/>
				</div>
				<label className="control-label col-sm-4">{this.state.message}</label>
			</div>
		);
	}
	
});

var RememberMeCheck = React.createClass({
	render : function(){
		return(
			<div className="form-group">
			    <div className="col-sm-offset-2 col-sm-6">
			      <div className="checkbox">
			        <label>
			          <input type="checkbox" /> 记住我的登录信息
			        </label>
			      </div>
			    </div>
			 </div>
			);
	}
});

var ValidateCodeInput = React.createClass({
	getInitialState : function(){
		return{
			validated : '0'
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
	render : function(){
		var classString = this.props.validatedClass(this.state.validated);
		return(
			<div className={classString}>
				<div className="col-sm-offset-2 col-sm-6 ">
				<div className="input-group">
					<input type="text" 
						className="form-control" 
						placeholder="输入验证码" 
						onChange={this.handleChange}/>
						<span className="input-group-btn">
			        <button className="btn btn-default" type="button">获取验证码</button>
			      </span>
				</div>
				</div>
				<label className="control-label col-sm-4">{this.state.message}</label>
			</div>
		);
	}
});

var RegisterForm = React.createClass({
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
	handleClick : function(){
		if(!validator.isMobilePhone(this.state.userName, 'zh-CN') || !validator.isLength(this.state.password,6,18)) {
			this.setState({alertMessage:'请输入正确的手机号码和密码格式'});
			return;
		}
		var registerData = {userName : this.state.userName,password : this.state.password};
		UserActions.register(registerData);
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
	        	<ValidateCodeInput />
	        	<RegisterButton handleClick={this.handleClick}
	        		validatedClass={this.getValidatedClass} toLogin={this.props.toLogin}/>
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
	      		<RegisterForm toLogin={this.props.login}/>
	      	</Modal.Body>
	      </Modal>
    );
  }
});

module.exports = RegisterPanel;
