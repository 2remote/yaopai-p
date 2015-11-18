var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var Link = Router.Link;
var History = Router.History;

var Header = require('./header');
var Footer = require('./footer');

var OrderStore = require('../stores/OrderStore');
var OrderActions = require('../actions/OrderActions');
var UserStore = require('../stores/UserStore');
var UserActions = require('../actions/UserActions');
var Input = require('react-bootstrap').Input;

var ListGroup = require('react-bootstrap').ListGroup;
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var Table = require('react-bootstrap').Table;

var Collapse = require('react-bootstrap').Collapse;
var Modal = require('react-bootstrap').Modal;
/**
 * ------------------------------------------------------------------
 * 右边导航--->ListGroup组件
 * ------------------------------------------------------------------
 */
var OrderManagerNav = React.createClass({
  render: function () {
    /*吻合UI设计图，所做一些样式覆盖*/
    var navStyle = {
      group: {
        width: '175px',
        color: '#838383',
      },
      itemStyle: {
        paddingRight: '10px',
      }
    }
    return (
      <ListGroup style={navStyle.group}>
        <ListGroupItem>
          <span className="glyphicon glyphicon-upload" aria-hidden="true" style={navStyle.itemStyle}></span>
          <Link to={'/order/out/'+this.props.orderState}>预约</Link>
          </ListGroupItem>
        <ListGroupItem>
          <span className="glyphicon glyphicon-download" aria-hidden="true" style={
            navStyle.itemStyle}></span>
          <Link to={'/order/in/'+this.props.orderState}>被预约</Link>
        </ListGroupItem>
      </ListGroup>
    );
  }
});
/**
 * ------------------------------------------------------------------
 * 左侧表格栏--->顶部预约状态
 * ------------------------------------------------------------------
 */
var OrderListTop = React.createClass({
  render: function () {
    /*所需样式*/
    var orderListTopStyle = {
      orderWay: {
        fontSize: '20px',
        color: '#777777',
      },
      iconTop: {
        paddingRight: '10px'
      },
      ulStyle: {
        listStyle: 'none',
      },
      liStyle: {
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: '#777777',
        width: '60px',
        height: '34px',
        lineHeight: '34px',
        textAlign: 'center',
        marginLeft: '16px'
      }
    };
    return (
      <div className="clearfix">
        <p className="pull-left order-way" style={orderListTopStyle.orderWay}>
          <span className="glyphicon glyphicon-download" aria-hidden="true" style={orderListTopStyle.iconTop}></span>
          <span>{this.state=='in'?'被预约' : '预约'}</span>
        </p>
        <ul className="pull-right order-status" style={orderListTopStyle.ulStyle}>
          <li className="pull-right" style={orderListTopStyle.liStyle}>
            <Link to={'/order/'+this.props.type+'/pending'}>待确认</Link>
          </li>
          <li className="pull-right" style={orderListTopStyle.liStyle}>
            <Link to={'/order/'+this.props.type+'/finished'}>已完成</Link>
          </li>
          <li className="pull-right" style={orderListTopStyle.liStyle}>
            <Link to={'/order/'+this.props.type+'/closed'}>已关闭</Link>
          </li>
        </ul>
      </div>
    );
  }
});
/**
 * ------------------------------------------------------------------
 * 左侧表格栏--->标题
 * ------------------------------------------------------------------
 */
var OrderTitle = React.createClass({
  render: function () {
    var orderTitleStyle = {
      titleContainer: {
        backgroundColor: '#1f2f3f',
        color: '#c8c8c8',
        textAlign: 'center',
        marginLeft: '0px',
        marginRight: '0px',
      },
      title: {
        height: '52px',
        lineHeight: '52px',
        fontSize: '14px',
      }
    }
    return (
      //---栅格布局
      <div className="row" style={orderTitleStyle.titleContainer}>
        <div style={orderTitleStyle.title} className="col-xs-2">客户</div>
        <div style={orderTitleStyle.title} className="col-xs-3">预约日期</div>
        <div style={orderTitleStyle.title} className="col-xs-2">客户姓名</div>
        <div style={orderTitleStyle.title} className="col-xs-3">客户电话</div>
        <div style={orderTitleStyle.title} className="col-xs-2">价格</div>
      </div>
    );
  }
});
/**
 * ------------------------------------------------------------------
 * 订单列表
 * ------------------------------------------------------------------
 */
var OrderItem = React.createClass({
  getInitialState: function () {
    return {
      orderInfoShow: false,
    }
  },
  handleCollapse: function () {
    this.setState({orderInfoShow: !this.state.orderInfoShow});
  },
  handleConfirm : function(e){
    this.props.confirm(this.props.order);
  },
  updateDate : function(e){
    console.log(e.target.value);
    this.props.updateDate(this.props.order,new Date(e.target.value));
  },
  dateFormat : function(date, format) {
      if(format === undefined){
          format = date;
          date = new Date();
      }
      var map = {
          "M": date.getMonth() + 1, //月份 
          "d": date.getDate(), //日 
          "h": date.getHours(), //小时 
          "m": date.getMinutes(), //分 
          "s": date.getSeconds(), //秒 
          "q": Math.floor((date.getMonth() + 3) / 3), //季度 
          "S": date.getMilliseconds() //毫秒 
      };
      format = format.replace(/([yMdhmsqS])+/g, function(all, t){
          var v = map[t];
          if(v !== undefined){
              if(all.length > 1){
                  v = '0' + v;
                  v = v.substr(v.length-2);
              }
              return v;
          }
          else if(t === 'y'){
              return (date.getFullYear() + '').substr(4 - all.length);
          }
          return all;
      });
      return format;
  },
  render: function () {
    var itemStyle = {
      topItem: {
        backgroundColor: '#1f2f3f',
        color: '#c8c8c8',
        fontSize: '12px',
        height: '30px',
        lineHeight: '30px'
      },
      orderTime: {
        marginLeft: '5px',
        marginRight: '30px'
      },
      infoWrap: {
        marginLeft: '0px',
        marginRight: '0px',
        backgroundColor: '#fff',
        height: '142px',
        color: '#777777',
        fontSize: '18px',
        marginBottom:'1px',
        position: 'relative',
      },
      commonInfo: {
        textAlign: 'center',
        lineHeight: '142px',
      },
      bookDate: {
        textAlign: 'center',
        lineHeight: '140px',
      },
      dateInput: {
        border: 0,
        paddingLeft: '30%',
      },
      price: {
        textAlign: 'center',
        lineHeight: '142px',
        fontSize: '26px',
      },
      img: {
        borderRadius: '50%',
      },
      uniqueLineHeight: {
        textAlign: 'center',
        marginTop: '23px',
      },
      orderInfo: {
        marginLeft: '0px',
        marginRight: '0px',
        backgroundColor: '#fff',
        paddingTop: '22px',
        height: '156px',
        color: '#777777',
        fontSize: '12px',
      },
      writingLeft: {
        width: '30%',
      },
      writingRight: {
        width: '70%',
      },
      confirm: {
        backgroundColor: '#1f2f3f',
        color: '#fff',
        marginTop: '21px',
      },
      /*三角*/
      triangleShow: {
        width: '0px',
        height: '0px',
        borderWidth: '12px',
        borderColor: 'transparent',
        borderStyle: 'solid',
        borderBottomColor: '#d2d5d9',
        borderRightColor: '#d2d5d9',
        position: 'absolute',
        right: '4px',
        bottom: '4px',
        zIndex: '9',
      },
      triangleHide: {
        width: '0px',
        height: '0px',
        borderWidth: '12px',
        borderColor: '#fff',
        borderStyle: 'solid',
        borderTopColor: '#d2d5d9',
        borderLeftColor: '#d2d5d9',
        position: 'absolute',
        right: '4px',
        bottom: '4px',
        zIndex: '9',
      }
    };
    var triangleClass = this.state.orderInfoShow? itemStyle.triangleHide: itemStyle.triangleShow;
    var bottomInfo;
    if (this.props.order.Albums) {
      bottomInfo = (
        <div>
          <div className="col-xs-3 col-xs-offset-2">
            <img src={this.props.order.Albums? this.props.order.Albums.Cover : ''} width="100" height="80" />
          </div>
          <div className="col-xs-5 order-writing clearfix">
            <div className="writing-left pull-left" style={itemStyle.writingLeft}>
              <p>作品名称：</p>
              <p>包含服务：</p>
            </div>
            <div className="writing-right pull-right" style={itemStyle.writingRight}>
              <p>{this.props.order.Albums?this.props.order.Albums.Title : ''}</p>
              <p>{this.props.order.Albums?this.props.order.Albums.Service : ''}</p>
            </div>
          </div>
        </div>
      )
    } else {
      bottomInfo = (
        <div>
          <div className="col-xs-3 col-xs-offset-2">
          </div>
          <div className="col-xs-5 order-writing clearfix">
          </div>
        </div>
      )
    };
    var ButtonName;
    if (this.props.order.State == 0) {
      ButtonName = '待确认';
    } else if (this.props.order.State == 1) {
      ButtonName = '已完成';
    } else {
      ButtonName = '用户已取消';
    }
    return (
      <div >
        <div className="itemTop" style={itemStyle.topItem}>
          <span style={itemStyle.orderTime}>{this.props.order.CreationTime}</span>
          <span>订单号：<b>{this.props.order.Id}</b></span>
        </div>
        <div className="row" style={itemStyle.infoWrap}>
          <div style={triangleClass} onClick={this.handleCollapse}></div>
          <div style={itemStyle.uniqueLineHeight} className="col-xs-2">
            <img style={itemStyle.img} src={this.props.order.User.Avatar?this.props.order.User.Avatar:'img/default_user_img.png'} width="60" heigth="60"/>
            <p>{this.props.order.User.NickName}</p>
          </div>
          <div className="col-xs-3" style={itemStyle.bookDate}>
            <input style={itemStyle.dateInput} type="date" value={this.dateFormat(new Date(this.props.order.AppointedTime),'yyyy-MM-dd')} onChange={this.updateDate}/>
          </div>
          <div className="col-xs-2" style={itemStyle.commonInfo}>
            {this.props.order.BuyerName}
          </div>
          <div className="col-xs-3" style={itemStyle.commonInfo}>
            {this.props.order.BuyerTel}
          </div>
          <div className="col-xs-2" style={itemStyle.price}>
            {this.props.order.Price?this.props.order.Price : '面议'}
          </div>
        </div>
        <Collapse in={this.state.orderInfoShow}>
          <div>
            <div className="order-info row" style={itemStyle.orderInfo}>
              {bottomInfo}
              <div className="col-xs-2">
                <button className="btn btn-default btn-sm confirm" style={itemStyle.confirm} onClick={this.handleConfirm}>{ButtonName}</button>
              </div>
            </div>
          </div>
        </Collapse>
      </div>
    );
  }
})

/**
 * ------------------------------------------------------------------
 * 确认订单
 * ------------------------------------------------------------------
 */
var ConfirmOrder = React.createClass({
  getInitialState : function() {
    return { 
      showModal: false,
      order : '',
    };
  },
  close : function() {
    this.setState({ showModal: false, order : '' });
  },

  open : function(order) {
    this.setState({ showModal: true, order : order });
  },
  confirm : function(e){
    this.props.confirm(this.state.order);
    this.close();
  },
  render: function () {
    var confirmOrderStyle = {
      confirmWrap: {
        backgroundColor: '#fff',
        paddingLeft: '10%',
        paddingRight: '10%',
        paddingTop: '26px',
        textAlign: 'center',
        color: '#777777',
      },
      icon: {
        fontSize: '80px',
        color: '#221f1f',
      },
      title: {
        fontSize: '30px',
        fontWeight: 'normal',
      },
      confirmBtn: {
        marginTop: '10px',
        backgroundColor: '#1f2f3f',
        color: '#fff',
      }
    };
    return (
      <Modal show={this.state.showModal} onHide={this.close} bsSize="small">
        <Modal.Header closeButton>
            <Modal.Title>确定订单</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div style={confirmOrderStyle.confirmWrap}>
              <span style={confirmOrderStyle.icon} className="glyphicon glyphicon-info-sign" aria-hidden="true" ></span>
              <h4 style={confirmOrderStyle.title}>确认订单</h4>
              <p>
                温馨提示：请您确认客户预约的时间和您的工作时间不冲突，您可以和客户沟通之后自行修改预约时间
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-default" style={confirmOrderStyle.confirmBtn} onClick={this.confirm}>确认</button>
          </Modal.Footer>
      </Modal>
    );
  }
});
/**
 * ------------------------------------------------------------------
 * 订单管理模块
 * ------------------------------------------------------------------
 */
var OrderManager = React.createClass({
  mixins : [Reflux.listenTo(OrderStore,'onOrderStoreChange'),Reflux.listenTo(UserStore,'onUserStoreChanged'),History],
  getInitialState : function(){
    return {
      orders : [],
    }
  },
  onUserStoreChanged : function(data){
    //判断是否登录
    if(data.isLogin){
      OrderActions.list(this.props.params.type,this.props.params.state);
    }else{
      this.history.pushState(null,'/');
    }
  },
  onOrderStoreChange : function(data){
    console.log(data);
    if(data.flag == 'list'){
      if(data.success)
        this.setState({orders : data.orders});
      else
        this.showMessage(data.hintMessage);
    }else if(data.flag == 'confirm'){
      this.showMessage(data.hintMessage);
      OrderActions.list(this.props.params.type,this.props.params.state);
    }else if(data.flag == 'close'){
      this.showMessage(data.hintMessage);
    }
  },
  componentWillReceiveProps : function (nextProps) {
    if(this.props.params.type != nextProps.params.type || this.props.params.state != nextProps.params.state){
      console.log(nextProps.params.type,nextProps.params.state);
      OrderActions.list(nextProps.params.type,nextProps.params.state);
    }
  },
  componentDidMount : function(){
    UserActions.currentUser();
  },
  showMessage : function(msg){
    console.log(msg);
  },
  showConfirmOrder : function(order){
    this.refs.confirmModal.open(order);
  },
  confirmOrder : function(order){
    OrderActions.confirm(order.Id,order.AppointedTime);
  },
  updateDate : function(order,date){
    var orders = this.state.orders;
    for(var i = 0 ; i < orders.length ; i ++){
      if(orders[i].Id == order.Id){
        orders[i].AppointedTime = date;
      }
    }
    this.setState({orders : orders});
  },
  render: function () {
    var orderItems = this.state.orders.map(function(item){
      return <OrderItem key={item.Id} order={item} confirm={this.showConfirmOrder} updateDate={this.updateDate}/>
    }.bind(this));
    return (
      <div className="container-fluid no-bgimg gray-bg">
        <Header />
        <div className="center-content">
          <div className="col-xs-9">
            <OrderListTop type={this.props.params.type}></OrderListTop>
            <OrderTitle></OrderTitle>
            {orderItems}
          </div>
          <div className="col-xs-3">
            <OrderManagerNav orderState={this.props.params.state}></OrderManagerNav>
            <ConfirmOrder ref="confirmModal" confirm={this.confirmOrder}/>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
});
module.exports = OrderManager;
