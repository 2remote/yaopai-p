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

var RightAlbumInfo = React.createClass({
  mixins: [Reflux.listenTo(AlbumsStore, 'onStoreChanged')],
  getInitialState: function () {
    return {
      isImgShow : false,
      isInfoShow : false,
      categories: null,
    }
  },
  onStoreChanged: function (data) {
    if (data.hintMessage) {
      console.log(data.hintMessage);
    } else {
      this.setState({categories: data.categories});
    }
  },
  componentDidMount: function () {
    var data = {
      Fields: 'Id,Name'
    };
    AlbumsActions.getCategories(data)
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
  moment : function (d) {
    return moment(d, "YYYY-MM-DDTHH:mm:ss").format("YYYY-MM-DD HH:mm")
  },
  render: function () {
    if (this.props.work && this.props.work.CategoryId && this.state.categories) {
      var album = this.props.work;
      var category = this.state.categories.find(function (obj) {
        return obj.Id == album.CategoryId;
      })
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
          <EditAlbumModal album={album} categories={this.state.categories} show={this.state.isInfoShow} hideHandle={this.hideInfoModal}/>
          <UploadPhotoModal album={album} uploadHandle={this.props.uploadHandle} show={this.state.isImgShow} hideHandle={this.hideImgModal}/>
          <Button bsStyle="primary" onClick={this.showInfoModal}>
            修改信息
          </Button>
          <Button bsStyle="primary" onClick={this.showImgModal}>
            上传照片
          </Button>
          <div>作品名称：{album.Title}</div>
          <div>作品简述：{album.Description}</div>
          <div>类 别：{category.Name}</div>
          <div>提供服务：{album.Service}</div>
          <div>定 价：{album.Price}</div>
          <div>状 态：{status}</div>
          <div>添加时间：{this.moment(album.CreationTime)}</div>
          <div>最后编辑时间：{this.moment(album.EditingTime)}</div>
        </div>
      );
    } else {
      return (
        <div>
        </div>
      )
    }
  }
});

module.exports = RightAlbumInfo;
