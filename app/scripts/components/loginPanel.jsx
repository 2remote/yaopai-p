var React = require('react');


var LoginButton = React.createClass({
	render : function(){
		return (
			<button className="btn btn-primary">登录</button>
			);
	}
});

var UserNameInput = React.createClass({
	render : function(){
		
	}
});

var LoginPanel = React.createClass({

  render: function() {

    return (
      <div>
        <p>Your content</p>
      </div>
    );
  }
});

module.exports = LoginPanel;
