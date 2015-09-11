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




var AboutLink = React.createClass({
	render: function(){
		return(
			<li>
				<Link to="/about">关于我们</Link>
			</li>
			);
	}
});

var CityLink = React.createClass({
	render : function() {
		return (
				<li><a href="#">郑州</a></li>
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
								<img src="../img/logo.png" />
							</a>
						</div>
						<ul className="nav navbar-nav">
							<CityLink />
						</ul>
						<ul className="nav navbar-nav">
							<li>
								<Link to="/">首页</Link>
							</li>
							<li>
								<Link to="/">作品</Link>
							</li>
							<li>
								<Link to="/">摄影师</Link>
							</li>
							<li>
								<Link to="/">访谈</Link>
							</li>
							<li>
								<Link to="/">活动</Link>
							</li>
							<li>
								<Link to="/">城市之美</Link>
							</li>
							<AboutLink />		
						</ul>
						<Acount />
					</div>
				</nav>
		);
	}
});

module.exports = Header;