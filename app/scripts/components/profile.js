var React = require('react');
var Reflux = require('reflux');
var { Link, History } = require('react-router');
var MasonryMixin = require('react-masonry-mixin')(React);
var Header = require('./header');
var NoData = require('./noData');

var UserPanel = require('./root/UserPanel');
/* Why be you when you can be NEW */
var AlbumAction = require('../actions/AlbumAction');
var UserAccountStore = require('../stores/UserAccountStore');
var { AlbumStore, ALBUM_NOT_FETCHED } = require('../stores/AlbumStore');
var QRCode = require('qrcode.react');
var _ = require('lodash');

/* 作品列表显示内容过滤 */
const ALBUM_DISPLAY_ON = 'album_display_on'; // 上架作品
const ALBUM_DISPLAY_OFF = 'album_display_off'; // 下架作品
const ALBUM_DISPLAY_ALL = 'album_display_all'; // 全部作品

/**
 * 头部header，用于展示“已上架作品”和“未上架作品”的按钮
 * Props:
 *   display: 当前作品展示的过滤条件
 *   changeDisplayFIlter: 修改当前展示作品过滤条件的方法
**/
var MainHeader = React.createClass({
  render: function() {
    return (
      <div className="row" style={{ paddingBottom: 15, marginBottom: 15, borderBottom: '1px solid #F6F6F6' }}>
        <div className="col-xs-6 text-right" style={{ borderRight: '1px solid #F6F6F6' }}>
          <a
            className={ this.props.display === ALBUM_DISPLAY_ON ? 'active' : 'inactive' }
            onClick={ () => this.props.changeDisplayFilter(ALBUM_DISPLAY_ON) }
          >
            已上架作品
          </a>
        </div>
        <div className="col-xs-6 text-left">
          <a
            className={ this.props.display === ALBUM_DISPLAY_OFF ? 'active' : 'inactive' }
            onClick={ () => this.props.changeDisplayFilter(ALBUM_DISPLAY_OFF) }
          >
            未上架作品
          </a>
        </div>
      </div>
    );
  },
});

/*
瀑布流布局配置参数
*/
var masonryOptions = {
  transitionDuration: '2s',
  gutter: 15,
  isFitWidth: true,
};

/**
 * AlbumList用来(按需)展示作品列表
 * State:
 *   album: 通过Reflux的connect获取作品列表数据
 * Props:
 *   userId: 用户Id
 *   display: 作品展示过滤条件
**/
var AlbumList = React.createClass({
  mixins: [
    Reflux.connect(AlbumStore, 'album'),
    MasonryMixin('masonryContainer', masonryOptions)
  ],
  /**
   * 利用上层传来的用户id来触发作品全列表的获取
  **/
  componentWillReceiveProps: function(nextProps) {
    const userId = nextProps.userId;
    // 仅在用户Id获取到且作品列表未获取时触发
    if(userId && this.state.album.status === ALBUM_NOT_FETCHED) {
      AlbumAction.fetch(userId);
    }
  },
  moveAlbum: function(albumId, step) {
    let { onSaleList, offSaleList } = this.state.album;
    let targetList;
    let targetIndex = -1;
    let resultList = [];
    targetList = onSaleList.concat(undefined).concat(offSaleList);
    if(!targetList || targetList.length === 0) { // awdw
      return;
    }
    targetList = targetList.map((album, index) => {
      if(album.id === albumId) {
        targetIndex = index;
      }
      return album.id;
    });
    // 遍历targetList，做排序调整
    // 增加-1和length处的值（js下是undefined），少写一些if else判断
    for(let count = -1; count <= targetList.length; count++) {
      let theIndex;
      if(count === targetIndex) {
        theIndex = targetIndex + step;
      } else if(count === targetIndex + step) {
        theIndex = targetIndex;
      } else {
        theIndex = count;
      }
      if(typeof targetList[theIndex] != 'undefined') {
        resultList.push(targetList[theIndex]);
      }
    }
    // console.log(resultList);
    AlbumAction.sort(resultList.toString());
  },
  onImgError: function (obj) {
    obj.target.src = "../../../img/loaderror.png";
  },
  render: function() {
    let self = this;
    let albumInfo = '';
    const display = self.props.display;
    let list; // 作品列表
    let noDataMsg = ''; // 列表为空的时候的message
    if(display === ALBUM_DISPLAY_ON) { // 上架作品
      list = self.state.album.onSaleList;
      noDataMsg = '您还没有作品，快去上传或上架吧！';
    } else if(display === ALBUM_DISPLAY_OFF) { // 下架作品
      list = self.state.album.offSaleList;
      noDataMsg = '暂无未上架作品';
    } else if(display === ALBUM_DISPLAY_ALL) { // 全部作品
      list = self.state.album.onSaleList.concat(self.state.album.offSaleList);
      noDataMsg = '您还没有作品，快去上传吧！';
    } else { // unknown filter
      list = [];
    }
    if(list && list.length > 0) {
      albumInfo = list.map((work, index) => (
          <div key={ index } style={{ border: '1px solid #F6F6F6', marginBottom: 15 }}>
            <Link to={ '/albums/' + work.id }>
              <img width='300' src={ work.cover + '?imageView2/2/w/300/interlace/1' } onError={ self.onImgError }/>
            </Link>
            <div>
              <span onClick={ e => self.moveAlbum(work.id, -1) }>左</span>
              ----------------
              <span onClick={ e => self.moveAlbum(work.id, 1) }>右</span>
            </div>
          </div>
      ));
    } else {
      albumInfo = <NoData message={ noDataMsg }/>;
    }
    return (
      <div className="row">
        <div ref="masonryContainer" className="center-block">
          { albumInfo }
        </div>
      </div>
    );
  }
});

/**
 * 作品信息(这名字怎么这么邪)
 * State:
 *   userInfo: 通过Reflux的connect获取。其实是为了获取用户ID，然后交给作品列表去获取作品
 *   display: 作品展示的过滤条件
**/
var Profile = React.createClass({
  mixins: [
    Reflux.connect(UserAccountStore, 'userInfo')
  ],
  getInitialState: function() {
    return {
      /* 作品列表显示内容过滤 */
      display: ALBUM_DISPLAY_ON,
    };
  },
  changeDisplayFilter: function(newDisplayFilter) {
    this.setState({
      display: newDisplayFilter,
    });
  },
  render: function() {
    return (
      <div>
        <Header />
        <div className="container-fluid no-bgimg gray-bg">
          <div  className="container-fluid">
            <div className="row" style={{padding: 10}}>
              <div className="col-sm-3 hidden-xs">
                <UserPanel />
              </div>
              <div className="col-sm-9">
                <div className="panel panel-default">
                  <div className="panel-body">
                    <MainHeader
                      display={ this.state.display }
                      changeDisplayFilter={ this.changeDisplayFilter }
                    />
                    <AlbumList
                      display={ this.state.display }
                      userId={ this.state.userInfo.basic.id }
                      pageIndex = {this.state.pageIndex}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

module.exports = Profile;
