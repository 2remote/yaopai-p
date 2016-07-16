var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;

var AccountCenter = React.createClass({
  render: function() {
    return (
      <div className="container-fluid no-bgimg gray-bg">
        <div className="center-content">
          <div className="col-xs-12">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
});
module.exports = AccountCenter;
