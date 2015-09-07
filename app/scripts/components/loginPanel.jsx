var React = require('react');
var Router = require('react-router');
var Link  = Router.Link;
var validator = require('validator');
var UserActions = require('../actions/UserActions');

/*
	验证逻辑放到相关的表单组件
	组件间的调用统一在LoginForm中实现
*/
var getValidatedClass = function(validated){
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
};

var LoginButton = React.createClass({
	
	render : function(){
		return (
			<div className="form-group">
    			<div className="col-sm-offset-2 col-sm-4">
    				<div className="col-sm-5">
						<button className="btn btn-primary btn-lg" onClick={this.props.handleClick}>登  录</button>
					</div>
					<div className="col-sm-4">
						<Link to="/register"><button className="btn btn-success btn-lg">还没有YAOPAI的账户？</button></Link>
					</div>
				</div>

			</div>
			);
	}
});


/*
	用户名文本组件
*/
var UserNameInput = React.createClass({
	getInitialState : function(){
		return {
			userName : '',
			message : '',
			validated : '0'
		};
	},
	handleBlur : function(event){
		var phoneNumberValid = validator.isMobilePhone(event.target.value, 'zh-CN');
		if(phoneNumberValid){
			this.setState({message : '', validated : '1'});
		}else{
			this.setState({message : '请输入正确的手机号码', validated : '2'});
		}
	},
	handleChange : function(event){
		this.state.userName = event.target.value;
	},
	render : function(){
		var classString = getValidatedClass(this.state.validated);
		return(
			<div className = {classString}>
				<div className="col-sm-offset-2 col-sm-6">
					<input type="text" className="form-control" value={this.props.userName} placeholder="手机号码" onBlur={this.handleBlur} onChange={this.props.handleChange}/>
				</div>
				<label className="control-label col-sm-4">{this.state.message}</label>
			</div>
		);
	}
});

/*
	密码组件
*/
var UserPasswordInput = React.createClass({
	getInitialState : function(){
		return {
			password : '',
			message : '',
			validated : '0'
		};
	},
	handleBlur : function(event){
		var passwordValid = validator.isLength(event.target.value, 6,18);
		if(passwordValid){
			this.setState({message : '', validated : '1'});
		}else{
			this.setState({message : '密码长度为6-18', validated : '2'});
		}
	},
	render : function(){
		var classString = getValidatedClass(this.state.validated);
		return(
			<div className={classString}>
				<div className="col-sm-offset-2 col-sm-6">
					<input type="password" className="form-control" value= {this.props.password} placeholder="用户密码" id="userPasswordInput" onBlur={this.handleBlur} onChange={this.props.handleChange}/>
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
			    <div className="col-sm-offset-2 col-sm-8">
			      <div className="checkbox">
			        <label>
			          <input type="checkbox" onChange={this.props.checkedChange}/> 记住我的登录信息
			        </label>
			      </div>
			    </div>
			 </div>
			);
	}
});

var LoginForm = React.createClass({
	getInitialState : function(){
		return {
			userName : '',
			password : '',
			rememberMe : false
		}
	},
	handleClick : function(event){
		if(!validator.isMobilePhone(this.state.userName, 'zh-CN') || !validator.isLength(this.state.password,6,18)) return;
		var loginData = {userName : this.state.userName,password : this.state.password};
		UserActions.login(loginData);
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
	render : function(){
		return(
			<div className="panel-body">
				<form className="form-horizontal">
						<UserNameInput userName = {this.state.userName} handleChange={this.handleUserNameChange}/>
	        	<UserPasswordInput password = {this.state.password} handleChange={this.handlePasswordChange}/>
	        	<RememberMeCheck checkedChange = {this.handleCheckedChange} />
	        	<LoginButton handleClick={this.handleClick}/>
				</form>
			</div>
		);
	}
});

var LoginPanel = React.createClass({

  render: function() {

    return (
    	<div className="panel panel-default opacity90">
    		<div className="panel-heading">
    			登录YAOPAI分享你自己的艺术
    		</div>
      		<LoginForm />
      	</div>
    );
  }
});

module.exports = LoginPanel;
