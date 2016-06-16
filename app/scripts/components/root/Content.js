/**
 * Main frame for the app.
 *
 * @since 2016-06-14
**/
var React = require('react');

/* Components inside this main frame. */
var Navbar = require('./Navbar');
var UserPanel = require('./UserPanel');

const Content = React.createClass({
  render: function() {
    return (
      <div>
        <Navbar />
        <div  className="container-fluid">
          <div className="row" style={{padding: 10}}>
            <div className="col-sm-3 hidden-xs main-container">
              <UserPanel />
            </div>
            <div className="col-sm-9 main-container">
              <div className="panel panel-default">
                <div className="panel-body">
                  { this.props.children }
                </div>    
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

module.exports = Content;
