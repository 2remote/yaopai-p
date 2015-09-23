var React = require('react');
var Reflux = require('reflux');

var Router = require('react-router');
var Link = Router.Link;

var OrderStore = require('../stores/OrderStore');
var OrderActions = require('../actions/OrderActions');
var Input = require('react-bootstrap').Input;
var Collapse = require('react-bootstrap').Collapse;

var OrderManagerNav = React.createClass({
  render : function(){
    var navStyle = {
      cursor : 'pointer',

    }
    return (
      <div>
        <ul className="list-group">
          <li className="list-group-item"><Link to="/order/myInquiry">我的预约</Link></li>
          <li className="list-group-item"><Link to="/order/myOrder">我的订单</Link></li>
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
  getInitialState : function(){
    return {
      detailOpen : false,
    }
  },
  getDefaultProps : function(){
    return{
      order : {}
    }
  },
  handleOpenDetail : function(){
    this.setState({detailOpen : !this.state.detailOpen});
  },
  render : function(){
    var itemStyle = {
      item : {
        marginLeft : '0px',
        marginRight : '0px',
      },
      header : {
        backgroundColor : '#1f2f3f',
        color : '#777777',
      }, 
      photographer : {
        backgroundColor : '#f7f7f7',
        height : '60px',
        paddingTop : '10px',
        paddingLeft : '20px',
      },
      content : {
        backgroundColor : '#FFFFFF',
        height : '60px',
        paddingTop : '10px',
        paddingLeft : '20px',
        borderLeft : '2px solid #eaeaea'
      },
      detail : {
        marginRight : '0px',
        marginLeft : '0px',
      },
      detailPhotographoer : {
        height : '80px',
        backgroundColor : '#f7f7f7',
        paddingTop : '10px',
        paddingLeft : '20px',
      },
      detailContent : {
        height : '80px',
        backgroundColor : '#FFFFFF',
        paddingTop : '10px',
        paddingLeft : '20px',
        borderLeft : '2px solid #eaeaea'
      },
      openCloseButton : {
        position : 'absolute',
        paddingTop : '40px',
        cursor : 'pointer',
        right : '0px',
        bottom : '0px',
      }
    };
    var detailBtn = '';
    if(this.state.detailOpen){
      detailBtn = 'glyphicon glyphicon-triangle-bottom';
    }else{
      detailBtn = 'glyphicon glyphicon-triangle-top';
    }
    
    return(
      <div className="row order-item" style={itemStyle.item}>
        <div className="order-item-title" style={itemStyle.header}>
          2015.10.20   -------   订单号
        </div>
        <div className="col-xs-3" style={itemStyle.photographer}>
          <img src = {this.props.order.photographer.avator} />
          {this.props.order.photographer.name}
        </div>
        <div className="col-xs-3" style={itemStyle.content}>
          <Input type="date" defaultValue={this.props.order.date} />
        </div>
        <div className="col-xs-2" style={itemStyle.content}>
          {this.props.order.customer.phoneNumeber}
        </div>
        <div className="col-xs-2" style={itemStyle.content}>
          {this.props.order.customer.name}
        </div>
        <div className="col-xs-2" style={itemStyle.content}>
          {this.props.order.price}
          <span className={detailBtn} onClick={this.handleOpenDetail} style={itemStyle.openCloseButton}></span>
        </div>
        <Collapse in={this.state.detailOpen}>
          <div className="row" style={itemStyle.detail}>
            <div className="col-xs-3" style={itemStyle.detailPhotographoer}>
              摄影师姓名
              {this.props.order.photographer.phoneNumeber}
              摄影师微信
              {this.props.order.photographer.wechate}
            </div>
            <div className="col-xs-7" style={itemStyle.detailContent}>
              {this.props.order.photographer.service}
            </div>
            <div className="col-xs-2" style={itemStyle.detailContent}>
              <button className="btn btn-primary">确认</button>
            </div>
          </div>
        </Collapse>
      </div>
    )
  },
});

var OrderList = React.createClass({
  mixins: [Reflux.listenTo(OrderStore, 'handleStatus')],
  getInitialState : function(){
    return{
      orders : []
    }
  },
  componentDidMount : function(){
    OrderActions.listOrders(this.props.type);
  },
  handleStatus : function(data){
    this.setState({orders : data});
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
      orderType : 'myInquiry'
    }
  },
  render: function() {

    return (
      <div className="center-content">
        <div className="col-xs-10">
            <OrderList type={this.props.params.type}/>
        </div>
        <div className="col-xs-2">
          <OrderManagerNav />
        </div>
      </div>
    );
  }
});

module.exports = OrderManager;
