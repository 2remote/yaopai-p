var React = require('react');
var IndexCover = require('./indexCover');

var Home = React.createClass({

  render: function() {

    return (
      <IndexCover>
        <div className="jumbotron">Home</div>
      </IndexCover>
    );
  }
});

module.exports = Home;
