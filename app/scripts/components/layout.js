var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;

var IndexCover = require('./indexCover');

var Layout = React.createClass({
  render: function() {
    var layoutStyle = {
      height : '100%'
    };
    return (
      <div style={layoutStyle}>
          {this.props.children}
      </div>
    );
  }
});

module.exports = Layout;
