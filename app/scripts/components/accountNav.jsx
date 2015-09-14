var React = require('react');
var Router = require('react-router');
var Link  = Router.Link;

/*
  个人中心的导航列表
*/
var AccountNav = React.createClass({

  render: function() {

    return (
      <div>
        <ul className="list-group">
          <li className="list-group-item"><Link to="/account/personInfo">个人信息</Link></li>
          <li className="list-group-item"><Link to="/account/info">账户信息</Link></li>
          <li className="list-group-item"><Link to="/account/pAuth">摄影师认证</Link></li>
        </ul>
      </div>
    );
  }
});

module.exports = AccountNav;
