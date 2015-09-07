var React = require('react');

var MessageBox = React.createClass({
  getInitialState : function(){
    return {
      isShow : false,
      message : ''
    }
  },
  render: function() {

    return (
      <div className="jumbotron" ></div>
    );
  }
});

module.exports = Home;
