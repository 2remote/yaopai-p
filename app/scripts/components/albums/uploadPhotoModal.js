var React = require('react');
var Reflux = require('reflux');
var AlbumsActions = require('../../actions/AlbumsActions');
var AlbumsStore = require('../../stores/AlbumsStore');
var Button = require('react-bootstrap').Button;
var Modal = require('react-bootstrap').Modal;
var ModalHeader = require('react-bootstrap').ModalHeader;
var ModalTitle = require('react-bootstrap').ModalTitle;
var ModalBody = require('react-bootstrap').ModalBody;
var ModalFooter = require('react-bootstrap').ModalFooter;
var InfoHeader = require('../infoHeader');
var ChooseImage = require('../account/chooseImage');
var ToolTip = require('../toolTip');
var WorkStore = require('../../stores/WorkStore');

var UploadPhotoModal = React.createClass({
  mixins: [Reflux.listenTo(AlbumsStore, 'onStoreChanged'), Reflux.listenTo(WorkStore, 'onWorkStoreChange')],
  getInitialState: function () {
    return {
      categories: [],
      photos: [],
      tags: []
    }
  },
  getDefaltProps: function () {
    return {
      value: 0,
      onChange: function (data) {
      },
    }
  },
  showImgModal() {
    this.setState({isImgShow: true});
  },
  hideImgModal() {
    this.setState({isImgShow: false});
  },
  handleImgSubmit: function () {
    var data = this.props.album;
    this.props.album.Photos.map(function (photo, i) {
      data['photos[' + i + '].Url'] = photo.Url;
      data['photos[' + i + '].Description'] = photo.Description;
    })
    var photocount = this.props.album.Photos.length;
    var coverUrl = '';
    this.state.photos.map(function (photo, i) {
      if (photo.isCover) {
        coverUrl = photo.Url;
      }
      var photoindex = photocount + i;
      data['photos[' + photoindex + '].Url'] = photo.Url;
      data['photos[' + photoindex + '].Description'] = photo.Description;
    });
    if (coverUrl != '') {
      data.Cover = coverUrl;
    }
    AlbumsActions.update(data);
    this.props.uploadHandle();
    this.hideImgModal();
  },
  onStoreChanged: function (data) {
    if (data.flag == 'add') {
      if (data.hintMessage) {
        this.showMessage(data.hintMessage)
      } else {
        this.showMessage('上传成功，您可以继续上传');
        //清空数据
        this.setState({
          title: '',
          category: '',
          description: '',
          service: '',
          price: 0,
          cover: -1,
          photos: [],
          tags: []
        });
        //同时要清空WorkStore的数据
        this.refs.chooseImage.clearImage();
      }
    }
    if (data.flag == 'get') {
      //处理get请求结果
    }
    if (data.flag == 'update') {
      //处理更新后的结果
    }
  },
  onWorkStoreChange: function (data) {
    //处理封面
    var cover = -1;
    for (var i = 0; i < data.length; i++) {
      if (data[i].isCover) cover = i;
    }
    this.setState({photos: data, cover: cover});
  },
  render: function () {
    return (
      <div>
        <Button bsStyle="primary" onClick={this.showImgModal}>
          上传照片
        </Button>
        <Modal
          show={this.state.isImgShow}
          onHide={this.hideImgModal}
          dialogClassName="custom-modal">
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-lg"></Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InfoHeader infoTitle="作品上传" infoIconClass="glyphicon glyphicon-picture" titleImage=""/>

            <form className='form-horizontal'>
              <ChooseImage value={this.state.photos}
                           ref="chooseImage"/>

              <div className="row">
                <ToolTip ref="toolTip" title=""/>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleImgSubmit}>提交</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
});

module.exports = UploadPhotoModal;