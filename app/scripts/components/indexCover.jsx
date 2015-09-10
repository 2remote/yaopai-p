var React = require('react');

var IndexCover = React.createClass({
  
  render : function(){
		return (
			<div className="container-fluid bgimg">
				<div className="centerContent">
				{this.props.children}
				</div>
			</div>
			);
	}
});

module.exports = IndexCover;