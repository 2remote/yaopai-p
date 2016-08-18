var React = require('react');
var Reflux = require('reflux');
var validator = require('validator');
var moment = require('moment');
var Button = require('react-bootstrap').Button;
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
      isImgShow: false,
      isInfoShow: false,
      currentUser: UserStore.userData,
    }
  },
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
  moment: function (d) {
    return moment(d, "YYYY-MM-DDTHH:mm:ss").format("YYYY-MM-DD HH:mm")
  },
  showMessage: function (message) {
    this.refs.toolTip.toShow(message);
  },
  onRemove: function (event){
    var album = this.props.work;
    if (confirm("确定要删除作品?")) {
      AlbumsActions.delete(album);
      alert("作品删除成功!");
    }
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
    var tagColor = {};
    if (album.State == 0) {
      status = "未审核";
      tagColor = { background:'#FFAB1F' };
    } else if (album.State == 1) {
      status = "审核通过";
      tagColor = { background:'#38BC59' };
    } else if (album.State == 2) {
      status = "审核失败";
      tagColor = { background:'#D4482E' };
    }
    var placeType = '';
    if (album.Detail.PlaceType && album.Detail.PlaceType.constructor == Array) {
      album.Detail.PlaceType = album.Detail.PlaceType.join();
    }
    if (album.Detail.PlaceType && album.Detail.PlaceType.length > 0) {
      placeType = album.Detail.PlaceType.replace('Studio', '影棚').replace('Exterior', '外景').replace('Interior', '室内').replace('Null', '无');
    } else {
      placeType = '无';
    }
    return (

    <div className="col-md-8 detail-info">
      <EditAlbumModal album={album} categories={this.props.categories} uploadHandle={this.props.uploadHandle} show={this.state.isInfoShow} hideHandle={this.hideInfoModal} showMessage={this.showMessage}/>
      <UploadPhotoModal album={album} uploadHandle={this.props.uploadHandle} show={this.state.isImgShow} hideHandle={this.hideImgModal} showMessage={this.showMessage}/>
      <div className="detail-title">
        <span className="tag">{this.props.categories}</span>
        <span className="tag" style={tagColor}>{status==="审核失败"?album.FoulReason?'审核失败原因:'+album.FoulReason:'':status}</span>

        <h2>{album.Title}</h2>
        <span className="price">￥{album.Price} 元</span>
      </div>
      <div className="cf"></div>
      <p className="des">
        {album.Description?album.Description:'暂无描述'}
      </p>
      <div className="panel">
        <h3>提供服务</h3>
        <ul className="detail-item">
          <li>
            <p>拍摄时长: {album.Detail.Duration}</p>
            <p>底片张数: {album.Detail.PlateCount} 张</p>
            <p>精修张数: {album.Detail.TruingCount} 张</p>
            <p>服装数目: {album.Detail.CostumeCount} 套</p>
            <p>化妆造型: {album.Detail.MakeUpSupport ? '提供' : '不提供'}</p>
            <p>原片提供: {album.Detail.OriginalSupport ? '全送' : '不送'}</p>
            <p>实体产品: {album.Detail.MakeUpSupport ? '提供' : '不提供'}</p>
          </li>
          <li>
            <p>产品详情: {album.Detail.PhysicalDetail ? album.Detail.PhysicalDetail : '暂无'}</p>
            <p>拍摄组数: {album.Detail.UnitCount} 组</p>
            <p>拍摄场景: {album.Detail.SceneCount} 个</p>
            <p>被拍人数: {album.Detail.PeopleCount} 人</p>
            <p>拍摄机位: {album.Detail.SeatCount} 个</p>
            <p>拍摄场地: {placeType} </p>
            <p>其他服务: {album.Service}</p>
          </li>
        </ul>

        <h3>其他信息</h3>
        <ul className="detail-item">
          <li>
            <p>创建时间: {this.moment(album.CreationTime)}</p>
            <p>最后编辑: {this.moment(album.EditingTime)}</p>
          </li>
        </ul>
      </div>
      <div className="btn-group">
        <a className="btn btn-lg btn-block btn-default " onClick={this.showImgModal}>添加作品图</a>
        <a className="btn btn-lg btn-block btn-default " onClick={this.showInfoModal}>修改信息</a>
        <a className="btn btn-lg btn-block btn-danger " onClick={this.onRemove}>删除作品</a>
      </div>
      <ToolTip ref="toolTip" title=""/>
    </div>
    );
  }
});

module.exports = RightAlbumInfo;
