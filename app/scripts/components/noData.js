var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;


var NoData = React.createClass({
  getDefaultProps: function () {
    return {
      message: '',
    }
  },
  render: function() {
    var layoutStyle = {
      height : '100%',
      marginTop: 100,
      textAlign:'center',
    };
    return (
      <div style={layoutStyle}>
        {this.props.message}
      </div>
    );
  }
});

module.exports = NoData;
