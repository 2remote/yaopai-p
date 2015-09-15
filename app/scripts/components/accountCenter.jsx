var React = require('react');
var Router = require('react-router');
var RouteHandler = Router.RouteHandler;

var AccountNav = require('./accountNav');
var AccountCenter = React.createClass({

  render: function() {

    return (
        <div className="centerContent">
          <div className="col-xs-10">
              {this.props.children}
          </div>
          <div className="col-xs-2">
            <AccountNav />
          </div>
        </div>
    );
  }
});

module.exports = AccountCenter;
