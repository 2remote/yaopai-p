var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;

var AccountNav = require('./accountNav');
var AccountCenter = React.createClass({

  render: function() {

    return (
      <div className="container-fluid nobgimg">
        <div className="common">
          <div className="col-xs-10">
            <RouteHandler />
          </div>
          <div className="col-xs-2">
            <AccountNav />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = AccountCenter;
