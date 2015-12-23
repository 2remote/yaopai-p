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

var RightAlbumInfo = React.createClass({
  mixins: [Reflux.listenTo(AlbumsStore, 'onStoreChanged'),UserStore],
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
  render: function () {
    var style = {
      btndiv: {
        width: "50%",
        float: "left",
        textAlign: "center",
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
        marginTop: "30px",
        height: "30px",
        float: "left",
        textAlign: "center",
      },
      right2: {
        width: "50%",
        marginTop:'-30px',
        height: "100px",
        float: "left",
        textAlign: "center",
      },
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
        <EditAlbumModal album={album} categories={this.props.categories} show={this.state.isInfoShow} hideHandle={this.hideInfoModal}/>
        <UploadPhotoModal album={album} uploadHandle={this.props.uploadHandle} show={this.state.isImgShow} hideHandle={this.hideImgModal}/>
        <div style={style.btndiv}>
          <Button bsStyle="primary" onClick={this.showInfoModal}>
            修改信息
          </Button>
        </div>
        <div style={style.btndiv}>
          <Button bsStyle="primary" onClick={this.showImgModal}>
            上传照片
          </Button>
        </div>
        <div style={style.leftdiv}>
          <div style={style.imgdiv}>
            <img style={style.img} src={this.state.currentUser.avatar}/>
          </div>
        </div>
        <div style={style.right1}><span>{this.state.currentUser.userName}</span></div>
        <div style={style.right2}>
          <div style={{backgroundColor:'#222f3f',height:'40px'}}>
            <div style={{height:'40px',float:'left'}}>
              <img style={{marginTop:'5px',marginLeft:'5px'}} src="../../../img/camera.png"/>
            </div>
            <div style={{color:'#fff'}}>
              <div style={{marginTop:'30px'}}>
                <div style={{height:'8px'}}></div>
                <div style={{fontSize:'20px'}}>{album.Price}</div>
              </div>
            </div>
          </div>
        </div>
        <div>作品简述：{album.Description}</div>
        <div>提供服务：{album.Service}</div>
        <div>状 态：{status}</div>
        <div>添加时间：{this.moment(album.CreationTime)}</div>
        <div>最后编辑时间：{this.moment(album.EditingTime)}</div>
      </div>
    );
  }
});

module.exports = RightAlbumInfo;
