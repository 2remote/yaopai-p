var React = require('react');
var Router = require('react-router');
var Link  = Router.Link;

var RegisterButton = React.createClass({
	render : function(){
		return (
			<div className="form-group">
    			<div className="col-sm-offset-2 col-sm-6">
    				<div className="col-sm-5">
						<button className="btn btn-primary btn-lg">注册新用户</button>
					</div>
					<div className="col-sm-4">
						<Link to="/login"><button className="btn btn-success btn-lg">已有账户?</button></Link>
					</div>
				</div>

			</div>
			);
	}
});



var UserNameInput = React.createClass({
	render : function(){
		return(
			<div className = "form-group">
				<div className="col-sm-offset-2 col-sm-6">
					<input type="text" className="form-control" placeholder="用户名" />
				</div>
			</div>
		);
	}
});

var UserPasswordInput = React.createClass({
	render : function(){
		return(
			<div className="form-group">
				<div className="col-sm-offset-2 col-sm-6">
					<input type="password" className="form-control" placeholder="用户密码" id="userPasswordInput" />
				</div>
			</div>
		);
	}
	
});

var UserPasswordRepeatInput = React.createClass({
	render : function(){
		return(
			<div className="form-group">
				<div className="col-sm-offset-2 col-sm-6">
					<input type="password" className="form-control" placeholder="再输入一次密码" />
				</div>
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

var RegisterForm = React.createClass({
	render : function(){
		return(
			<div className="panel-body">
				<form className="form-horizontal">
						<UserNameInput />
	        			<UserPasswordInput />
	        			<UserPasswordRepeatInput />
	        			<RememberMeCheck />
	        			<RegisterButton />
				</form>
			</div>
		);
	}
});

var RegisterPanel = React.createClass({

  render: function() {

    return (
    	<div className="panel panel-default opacity90">
    		<div className="panel-heading">
    			注册成为YAOPAI的用户，发现你的不同
    		</div>
      		<RegisterForm />
      	</div>
    );
  }
});

module.exports = RegisterPanel;
