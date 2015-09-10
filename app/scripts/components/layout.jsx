var React = require('react');
var Router = require('react-router');
var Header = require('./header');
var Footer = require('./footer');
var RouteHandler = Router.RouteHandler;

var IndexCover = require('./indexCover');

var Layout = React.createClass({
  getDefaultProps : function(){
    return {
      style : 'indexCover',
    }
  },
  render: function() {
        return (
          <div className="App">
            <Header />
              <RouteHandler />
            <Footer />
          </div>
        );
    
  }
});

module.exports = Layout;
