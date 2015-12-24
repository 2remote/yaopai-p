var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var Link = Router.Link;
var History = Router.History
var RouteHandler = Router.RouteHandler;
var Header = require('./header');
var UserActions = require('../actions/UserActions');
var UserStore = require('../stores/UserStore');



var AccountCenter = React.createClass({
  mixins : [Reflux.listenTo(Reflux.listenTo(UserStore,'onUserStoreChanged'),History],
  onUserStoreChanged : function(data){
    if(data.isLogin){
      //获取摄影师信息
      PhotograhperActions.get({Id : data.userId,Fields : 'Id,Signature,ProvinceName,CityName,CountyName,User.Avatar,User.NickName' });
    }else{
      this.history.pushState(null,'/');
    }
  },
  render: function() {
    return (
      <div className="container-fluid no-bgimg gray-bg">
        <Header />
        <div className="center-content">
          <div className="col-xs-9">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
});
module.exports = AccountCenter;
