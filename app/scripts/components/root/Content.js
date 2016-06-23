/**
 * Main frame for the app.
 *
 * @since 2016-06-14
**/
import React from 'react'

/* Components inside this main frame. */
import Navbar from './Navbar'
import UserPanel from './UserPanel'

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
                { this.props.children }
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
});

export default Content
