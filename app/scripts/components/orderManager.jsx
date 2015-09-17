var React = require('react');

var Router = require('react-router');
var Link = Router.Link;

var OrderStore = require('../stores/OrderStore');
var OrderAction = require('../actions/OrderActions');

var OrderManagerNav = React.createClass({
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

var OrderTitle = React.createClass({
  render: function(){
    return (
      <div className="order-title">
        <div className="col-xs-3">
          摄影师
        </div>
        <div className="col-xs-3">
          预约日期
        </div>
        <div className="col-xs-2">
          电话
        </div>
        <div className="col-xs-2">
          姓名
        </div>
        <div className="col-xs-2">
          价格
        </div>
      </div>
    )
  }
});


var OrderItem = React.createClass({
  getDefaultProps : function(){
    return{
      order : {}
    }
  },
  render : function(){
    <div className="order-item">
      <div className="order-item-title">
        2015.10.20   -------   订单号
      </div>
      <div className="col-xs-3">
        <img src = {this.props.order.photographer.avator} />
        {this.props.order.photographer.name}
      </div>
      <div className="col-xs-3">
        {this.props.order.date}
      </div>
      <div className="col-xs-2">
        {this.props.order.customer.phoneNumeber}
      </div>
      <div className="col-xs-2">
        {this.props.order.customer.name}
      </div>
      <div className="col-xs-2">
        {this.props.order.price}
      </div>
      <div>
        <div className="col-xs-3">
          摄影师姓名
          {this.props.order.photographer.phoneNumeber}
          摄影师微信
          {this.props.order.photographer.wechate}
        </div>
        <div className="col-xs-7">
          {this.props.order.photographer.service}
        </div>
        <div className="col-xs-7">
          {this.props.order.photographer.service}
        </div>
        <div className="col-xs-2">
          <button className="btn btn-primary">确认</button>
        </div>
      </div>
    </div>
  },
});

var OrderList = React.createClass({
  getInitialState : function(){
    return{
      orders : []
    }
  },
  render : function(){
    var getList = this.state.orders.map(function(item){
      return(
        <OrderItem order={item}/>
      )
    });
    return (
      <div>
        <div className="order-type">
          <h2>被预约</h2>
        </div>
        <OrderTitle />
        <div className="order-list">
          {getList}
        </div>
      </div>
    );
  }
});

/*
  OrderManager实现主要功能
  list，confirm
  根据orderType判断是“我的预约”还是“我的订单”
*/
var OrderManager = React.createClass({
  getInitialState : function(){
    return {
      orderType : '0'
    }
  },
  render: function() {

    return (
      <div className="center-content">
        <div className="col-xs-10">
            <OrderList type={this.state.orderType}/>
        </div>
        <div className="col-xs-2">
          <OrderManagerNav />
        </div>
      </div>
    );
  }
});

module.exports = OrderManager;
