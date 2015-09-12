var React = require('react');

var Footer = React.createClass({
	render: function(){
		return(
				<nav className="navbar navbar-default" >
					<div className="navbar-brand">
						YAOPAI
					</div>
					<div className="navbar-text pull-right">
						公司联系方式及备案信息
					</div>
				</nav>
		);
	}
});

module.exports = Footer;
