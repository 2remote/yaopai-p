import React from 'react'
import { Link } from 'react-router'

import Account from './headerAccount'

// const CityLink = React.createClass({
//   render : function() {
//     return (
//         <li><a href="#">郑州</a></li>
//       );
//   }
// });

const Header = React.createClass({
  render: function(){
    return(
        <nav className="navbar navbar-inverse navbar-fixed-top" role="navigation">
          <div className="container-fluid">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed"
                data-toggle="collapse" data-target="#header-nav" aria-expanded="false"
              >
                <span className="sr-only"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <Link to="/" className="navbar-brand">
                <img style={{ height: '90%' }} src="img/logo.png" />
              </Link>
            </div>
            <Account />
          </div>
        </nav>
    )
  }
});

export default Header
