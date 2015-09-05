var React = require('react');
var Router = require('react-router');
var Link  = Router.Link;

var LoginButton = React.createClass({
	render : function(){
		return (
			<div className="form-group">
    			<div className="col-sm-offset-2 col-sm-10">
    				<div className="col-sm-5">
						<button className="btn btn-primary btn-lg">登  录</button>
					</div>
					<div className="col-sm-5">
						<Link to="/register"><button className="btn btn-success btn-lg">还没有YAOPAI的账户？</button></Link>
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
				<div className="col-sm-offset-2 col-sm-10">
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
				<div className="col-sm-offset-2 col-sm-10">
					<input type="password" className="form-control" placeholder="用户密码" id="userPasswordInput" />
				</div>
			</div>
		);
	}
	
});

var RememberMeCheck = React.createClass({
	render : function(){
		return(
			<div className="form-group">
			    <div className="col-sm-offset-2 col-sm-10">
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
