var React = require('react');
var React = require('react');
var Router = require('react-router');
var Link  = Router.Link;
var Reflux = require('reflux');
var UserStore = require('../stores/userStore');

var validator = require('validator');
var UserActions = require('../actions/UserActions');
var UserNameInput = require('./user/userNameInput');
var UserPasswordInput = require('./user/userPasswordInput');
var AlertBox = require('./user/alertBox');


var LeftNavBar = React.createClass({
  render : function(){
    return <>
  }
});
var AcountCenter = React.createClass({

  render: function() {

    return (
      <div>
        <p>Your content</p>
      </div>
    );
  }
});

module.exports = AcountCenter;
