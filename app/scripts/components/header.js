var React = require('react');
var Router = require('react-router');
var Link  = Router.Link;

var Account = require('./headerAccount');

var CityLink = React.createClass({
  render : function() {
    return (
        <li><a href="#">郑州</a></li>
      );
  }
});

var Header = React.createClass({
  render: function(){
    return(
      <header role="banner" className="header">
          <nav className="nav navbar navbar-inverse navbar-fixed-top" role="navigation">
            <Link to="/profile">
              <div className="navbar-brand">
                <img style={{ height: '90%' }} src="img/logo.png" />
              </div>
            </Link>
            <Account />
          </nav>
      </header>
    );
  }
});

module.exports = Header;
