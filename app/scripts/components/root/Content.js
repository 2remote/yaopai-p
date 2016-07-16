/**
 * Main frame for the app.
 *
 * @since 2016-06-14
**/
import React from 'react'
import Reflux from 'reflux'
import { History } from 'react-router'
/* Components inside this main frame. */
import Navbar from './Navbar'
import UserPanel from './UserPanel'
/* Things a container typically requires */
import UserAccountStore from '../../stores/UserAccountStore'
import {
  PhotographerAuthStore, PHOTOGRAPHER_AUTH_DEFAULT, PHOTOGRAPHER_AUTH_NONE
} from '../../stores/auth/PhotographerAuthStore'
import { ROUTE_LOGIN } from '../../routeConfig'
var UserActions = require('../../actions/UserActions')
var AuthAction = require('../../actions/AuthAction')

const Content = React.createClass({
  mixins: [
    Reflux.connect(UserAccountStore, 'user'),
    Reflux.connect(PhotographerAuthStore, 'photographer'),
    History
  ],
  componentWillUpdate: function() {
    if(!this.state.user.isLogin) {
      this.history.pushState(null, ROUTE_LOGIN)
    } else if(this.state.photographer.status === PHOTOGRAPHER_AUTH_DEFAULT) {
      AuthAction.viewPhotographerAudit()
    }
  },
  doLogout: function() {
    if(confirm('确定要退出系统么?')){
      UserActions.logout(true)
    }
  },
  render: function() {
    let { status } = this.state.photographer
    return (
      <div>
        <Navbar
          photographerAuthed={
            status != PHOTOGRAPHER_AUTH_NONE && status != PHOTOGRAPHER_AUTH_DEFAULT
          }
          logout={ this.doLogout }
        />
        <div className="container-fluid">
          <div className="row" style={{padding: 10}}>
            <div className="col-sm-3 hidden-xs main-container">
              <UserPanel user={ this.state.user } logout={ this.doLogout } />
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
})

export default Content
