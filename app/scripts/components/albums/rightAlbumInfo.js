var React = require('react');
var Reflux = require('reflux');
var validator = require('validator');
var moment = require('moment');
var Button = require('react-bootstrap').Button;
var Header = require('./../header');
var AlbumsActions = require('../../actions/AlbumsActions');
var AlbumsStore = require('../../stores/AlbumsStore');
var EditAlbumModal = require('./editAlbumModal');
var UploadPhotoModal = require('./uploadPhotoModal');
var UserStore = require('../../stores/UserStore');
var ToolTip = require('../toolTip');

var RightAlbumInfo = React.createClass({
  mixins: [UserStore],//Reflux.listenTo(AlbumsStore, 'onStoreChanged'),
  getInitialState: function () {
    return {
      isImgShow : false,
      isInfoShow : false,
      currentUser: UserStore.userData,
    }
  },
  //onStoreChanged: function (data) {
  //  if (data.hintMessage) {
  //    console.log(data.hintMessage);
  //  } else {
  //    this.setState({categories: data.categories});
  //  }
  //},
  //componentDidMount: function () {
  //  var data = {
  //    Fields: 'Id,Name'
  //  };
  //  AlbumsActions.getCategories(data)
  //},
  showImgModal: function () {
    this.setState({isImgShow: true});
  },
  hideImgModal: function () {
    this.setState({isImgShow: false});
  },
  showInfoModal: function () {
    this.setState({isInfoShow: true});
  },
  hideInfoModal: function () {
    this.setState({isInfoShow: false});
  },
  moment : function (d) {
    return moment(d, "YYYY-MM-DDTHH:mm:ss").format("YYYY-MM-DD HH:mm")
  },
  showMessage : function(message){
    this.refs.toolTip.toShow(message);
  },
  render: function () {
    var style = {
      btndiv: {
        width: "50%",
        textAlign: "center",
        margin: '0 20px',
      },
      leftdiv: {
        float: "left",
        height: "120px",
        width: "50%",
        textAlign: "center",
      },
      imgdiv: {
        width: "100px",
        height: "100px",
        border: "1px solid #000",
        borderRadius: "100px",
        overflow: "hidden",
      },
      img: {
        width: "100px",
        height: "100px",
      },
      right1: {
        width: "50%",
        fontSize: '2em',
        height: "30px",
        float: "left",
        textAlign: "center",
      },
      right2: {
        width: "50%",
        height: "100px",
        float: "left",
        textAlign: "center",
      },
      info: {
        marginTop: 28,
      }
    }
    var album = this.props.work;
    var status = "";
    if (album.State == 0) {
      status = "未审核";
    } else if (album.State == 1) {
      status = "审核通过";
    } else if (album.State == 2) {
      status = "审核失败";
    }
    return (
      <div>
        <EditAlbumModal album={album} categories={this.props.categories} uploadHandle={this.props.uploadHandle} show={this.state.isInfoShow} hideHandle={this.hideInfoModal} showMessage={this.showMessage}/>
        <UploadPhotoModal album={album} uploadHandle={this.props.uploadHandle} show={this.state.isImgShow} hideHandle={this.hideImgModal} showMessage={this.showMessage}/>
        <span style={style.btndiv}>
          <Button bsStyle="primary" onClick={this.showInfoModal}>
            修改信息
          </Button>
        </span>
        <span style={style.btndiv}>
          <Button bsStyle="primary" onClick={this.showImgModal}>
            上传照片
          </Button>
        </span>
        <div style={style.info}>
          <div style={style.leftdiv}>
            <div style={style.imgdiv}>
              <img style={style.img} src={this.state.currentUser.avatar}/>
            </div>
          </div>
          <div style={style.right1}><span>{this.state.currentUser.userName}</span></div>
          <div style={style.right2}>
            <div style={{backgroundColor:'#222f3f',height:'40px'}}>
              <div style={{height:'40px',float:'left'}}>
                <img style={{marginTop:'5px',marginLeft:'5px'}} src="../../../img/money.png"/>
              </div>
              <div style={{color:'#fff'}}>
                <div style={{marginTop:'30px'}}>
                  <div style={{height:'8px'}}></div>
                  <div style={{fontSize:'20px',lineHeight: 'initial'}}>{album.Price}</div>
                </div>
              </div>
            </div>
          </div>
          <div style={{paddingTop:20,clear: 'left'}}>作品简述：
            <p>
              {_.map(album.Description.split('\n'), function (item,i) {
                return <div key={i}>{item}</div>;
              })}
            </p>
          </div>
          <div>提供服务：
            <p>
              {_.map(album.Service.split('\n'), function (item,i) {
                return <div key={i}>{item}</div>;
              })}
            </p>
          </div>
          <div>状 态：<p>{status}</p></div>
          <div>添加时间：<p>{this.moment(album.CreationTime)}</p></div>
          <div>最后编辑时间：<p>{this.moment(album.EditingTime)}</p></div>
        </div>
        <ToolTip ref="toolTip" title=""/>
      </div>
    );
  }
});

module.exports = RightAlbumInfo;
