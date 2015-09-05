var React = require('react');
var Router = require('react-router');
var Link  = Router.Link;

var Acount = require('./acount');


var SearchInput = React.createClass({
	render: function(){
		return(
			<input 
				type="text" 
				className="form-control" 
				placeholder="搜索...." />
		);
	}
});


var HomeLink = React.createClass({
	render: function(){
		return(
			<li>
				<Link to="/">首页</Link>
			</li>
			);
	}
});

var AboutLink = React.createClass({
	render: function(){
		return(
			<li>
				<Link to="/about">关于我们</Link>
			</li>
			);
	}
});

var Header = React.createClass({
	render: function(){
		return(
				<nav className="navbar navbar-inverse navbar-fixed-top" >
					<div className="container-fluid">
						<div className="navbar-header">
							<a className="navbar-brand" href="#">
								YAOPAI
							</a>
						</div>
						<ul className="nav navbar-nav">
							<HomeLink />
							<AboutLink />		
						</ul>
						<form className="navbar-form navbar-left" role="search">
						  <div className="form-group">
						  	<SearchInput />
						  </div>
						  <button type="submit" className="btn btn-primary">搜索</button>
						</form>
						
						<Acount />
					</div>
				</nav>
		);
	}
});

module.exports = Header;