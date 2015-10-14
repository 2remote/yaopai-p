var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;
var Header = require('./header');
var AccountNav = require('./accountNav');

var AccountNav = require('./accountNav');
var AccountCenter = React.createClass({
  render: function() {
    return (
      <div className="container-fluid no-bgimg gray-bg">
        <Header />
        <div className="center-content">
          <div className="col-xs-10">
            {this.props.children}
          </div>
          <div className="col-xs-2">
            <AccountNav  />
          </div>
        </div>
      </div>
    );
  }
});
module.exports = AccountCenter;
