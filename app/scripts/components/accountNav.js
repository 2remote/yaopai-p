var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var Link  = Router.Link;
var UserStore = require('../stores/UserStore');

/*
  个人中心的导航列表
*/
var AccountNav = React.createClass({
  mixins : [Reflux.listenTo(UserStore,'onUserStoreChange')],
  getInitialState : function(){
    return {
      isPhotographer : false
    }
  },
  onUserStoreChange : function(userData){
    if(userData.userType == 1){
      //已经审核为摄影师
      this.setState({isPhotographer : true});
    }else{
      this.setState({isPhotographer : false});
    }
  },
  render: function() {
    var style = {
      liStyle: {
        color: '#777777',
      },
      icon: {
        marginRight: '5px',
      }
    }
    return (
      <div>
        <ul className="list-group">
          <li className="list-group-item"><Link style={style.liStyle} to="/account/personInfo">
            <span className="glyphicon glyphicon-user" style={style.icon} aria-hidden="true"></span>
            个人信息
          </Link></li>
          <li className="list-group-item"><Link style={style.liStyle} to="/account/info">
            <span className="glyphicon glyphicon-cog" style={style.icon} aria-hidden="true"></span>
            账户信息
          </Link></li>
          <li className="list-group-item"><Link style={style.liStyle} to={this.state.isPhotographer?"/account/photographer":"/account/pAuth"}>
            <span className="glyphicon glyphicon-camera" style={style.icon} aria-hidden="true"></span>
            {this.state.isPhotographer?'摄影师信息':'摄影师认证'}
          </Link></li>
        </ul>
      </div>
    );
  }
});

module.exports = AccountNav;
