var React = require('react');
var React = require('react');
var Router = require('react-router');
var Link  = Router.Link;
var Reflux = require('reflux');
var UserStore = require('../stores/UserStore');

var validator = require('validator');
var UserActions = require('../actions/UserActions');
var UserNameInput = require('./user/userNameInput');
var UserPasswordInput = require('./user/userPasswordInput');
var AlertBox = require('./user/alertBox');
var Panel = require('react-bootstrap').Panel;


var AuthHeader = React.createClass({
  render : function(){
    return (
      <div className="row">
        <div className="col-sm-8">
          <span>摄影师认证</span>
        </div>
        <div className="col-sm-4">
          <span>未认证</span>
        </div>
      </div>
      )
  }
});

var PhotographerAuth = React.createClass({
  getInintialState: function(){
    return {
      authState : '0'
    }
  },
  render: function() {

    return (
      <div className="container-fluid nobgimg">
        <div className="common">
          <Panel>
            <AuthHeader />
          </Panel>
        </div>
      </div>
    );
  }
});

module.exports = PhotographerAuth;
