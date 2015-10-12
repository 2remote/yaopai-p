var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var Header = require('./header');
var Footer = require('./footer');

var OrderStore = require('../stores/OrderStore');
var OrderActions = require('../actions/OrderActions');
var Input = require('react-bootstrap').Input;

var ListGroup = require('react-bootstrap').ListGroup;
var ListGroupItem = require('react-bootstrap').ListGroupItem;
var Table = require('react-bootstrap').Table;

var Collapse = require('react-bootstrap').Collapse;

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
          预约
          </ListGroupItem>
        <ListGroupItem>
          <span className="glyphicon glyphicon-download" aria-hidden="true" style={
            navStyle.itemStyle}></span>
          被预约
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
          <span>被预约</span>
        </p>
        <ul className="pull-right order-status" style={orderListTopStyle.ulStyle}>
          <li className="pull-right" style={orderListTopStyle.liStyle}>进行中</li>
          <li className="pull-right" style={orderListTopStyle.liStyle}>已完成</li>
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
    return (
      <div className="item">
        <div className="itemTop" style={itemStyle.topItem}>
          <span style={itemStyle.orderTime}>2015/10/20 13:25:00</span>
          <span>订单号：<b>4332785748</b></span>
        </div>
        <div className="row" style={itemStyle.infoWrap}>
          <div style={triangleClass} onClick={this.handleCollapse}></div>
          <div style={itemStyle.uniqueLineHeight} className="col-xs-2">
            <img style={itemStyle.img} src="img/default_user_img.png" width="60" />
            <p>电磁猫</p>
          </div>
          <div className="col-xs-3" style={itemStyle.commonInfo}>
            2015/10/20
          </div>
          <div className="col-xs-2" style={itemStyle.commonInfo}>
            周宏晓
          </div>
          <div className="col-xs-3" style={itemStyle.commonInfo}>
            18538156075
          </div>
          <div className="col-xs-2" style={itemStyle.price}>
            ￥3000
          </div>
        </div>
        <Collapse in={this.state.orderInfoShow}>
          <div>
            <div className="order-info row" style={itemStyle.orderInfo}>
              <div className="col-xs-3 col-xs-offset-2">
                <img src="img/user.png" width="100"/>
              </div>
              <div className="col-xs-5 order-writing clearfix">
                <div className="writing-left pull-left" style={itemStyle.writingLeft}>
                  <p>作品名称：</p>
                  <p>包含服务：</p>
                </div>
                <div className="writing-right pull-right" style={itemStyle.writingRight}>
                  <p>欧洲婚礼跟拍</p>
                  <p>100 张底片全送，15 张精修用户自备服装，女化妆师全程4 小时全程 1 对 1 拍摄，</p>
                </div>
              </div>
              <div className="col-xs-2">
                <button className="btn btn-default btn-sm confirm" style={itemStyle.confirm}>确认</button>
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
  render: function () {
    var confirmOrderStyle = {
      confirmWrap: {
        backgroundColor: '#fff',
        height: '412px',
        marginLeft: '20px',
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
        marginTop: '40px',
        backgroundColor: '#1f2f3f',
        color: '#fff',
      }
    };
    return (
      <div className="confirm-order" style={confirmOrderStyle.confirmWrap}>
        <span style={confirmOrderStyle.icon} className="glyphicon glyphicon-info-sign" aria-hidden="true" ></span>
        <h4 style={confirmOrderStyle.title}>确认订单</h4>
        <p>
          温馨提示：请您确认客户预约的时间和您的工作时间不冲突，您可以和客户沟通之后自行修改预约时间
        </p>
        <button className="btn btn-default" style={confirmOrderStyle.confirmBtn}>确认</button>
      </div>
    );
  }
});
/**
 * ------------------------------------------------------------------
 * 订单管理模块
 * ------------------------------------------------------------------
 */
var OrderManager = React.createClass({
  render: function () {
    return (
      <div className="container-fluid no-bgimg gray-bg">
        <Header />
        <div className="center-content">
          <div className="col-xs-9">
            <OrderListTop></OrderListTop>
            <OrderTitle></OrderTitle>
            <OrderItem></OrderItem>
          </div>
          <div className="col-xs-3">
            <OrderManagerNav></OrderManagerNav>
            <ConfirmOrder></ConfirmOrder>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
});
module.exports = OrderManager;
