var React = require('react');
var Router = require('react-router');
var Link  = Router.Link;
var validator = require('validator');

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
						<button className="btn btn-primary btn-lg">登  录</button>
					</div>
					<div className="col-sm-4">
						<Link to="/register"><button className="btn btn-success btn-lg">还没有YAOPAI的账户？</button></Link>
					</div>
				</div>

			</div>
			);
	}
});



var UserNameInput = React.createClass({
	getInitialState : function(){
		return {
			message : '',
			validated : '0'
		};
	},
	handleBlur : function(event){
		var phoneNumberVoild = validator.isMobilePhone(event.target.value, 'zh-CN');
		if(phoneNumberVoild){
			this.setState({message : '', validated : '1'});
		}else{
			this.setState({message : '请输入正确的手机号码', validated : '2'});
		}
	},
	render : function(){
		var classString = getValidatedClass(this.state.validated);
		return(
			<div className = {classString}>
				<div className="col-sm-offset-2 col-sm-6">
					<input type="text" className="form-control" placeholder="手机号码" onBlur={this.handleBlur} value={this.props.userName}/>
				</div>
				<label className="control-label col-sm-4">{this.state.message}</label>
			</div>
		);
	}
});

var UserPasswordInput = React.createClass({
	getInitialState : function(){
		return {
			message : '',
			validated : '0'
		};
	},
	handleBlur : function(event){
		var passwordVoild = validator.isLength(event.target.value, 6,18);
		if(passwordVoild){
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
					<input type="password" className="form-control" placeholder="用户密码" id="userPasswordInput" onBlur={this.handleBlur}/>
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
			          <input type="checkbox" /> 记住我的登录信息
			        </label>
			      </div>
			    </div>
			 </div>
			);
	}
});

var LoginForm = React.createClass({
	render : function(){
		return(
			<div className="panel-body">
				<form className="form-horizontal">
						<UserNameInput />
	        			<UserPasswordInput />
	        			<RememberMeCheck />
	        			<LoginButton />
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
