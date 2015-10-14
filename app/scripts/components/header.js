var React = require('react');
var Router = require('react-router');
var Link  = Router.Link;

var Account = require('./headerAccount');

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
			<header role="banner" className="header">
					<nav className="nav navbar navbar-inverse navbar-fixed-top" role="navigation">
							<div className="navbar-header">
								<a className="navbar-brand" href="/">
									<img src="img/logo.png" />
								</a>
							</div>
							<div className="collapse navbar-collapse">
                {
                  /*
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
                </ul>
                  */
                }
								<Account />
							</div>
					</nav>
			</header>
		);
	}
});

module.exports = Header;