var React = require('react');


var OrderManagerNav = react.createClass({
  render : function(){
    return (
      <div>
        <ul className="list-group">
          <li className="list-group-item"><Link to="/account/personInfo">我的预约</Link></li>
          <li className="list-group-item"><Link to="/account/info">我的订单</Link></li>
        </ul>
      </div>
      );
  }
});
var OrderManager = React.createClass({

  render: function() {

    return (
      <div className="container-fluid nobgimg">
        <div className="common">
          <div className="col-xs-10">
              {this.props.children}
          </div>
          <div className="col-xs-2">
            <OrderManagerNav />
          </div>
        </div>
      </div>
    );
  }
});

module.exports = OrderManager;
