var React = require('react');
var Reflux = require('reflux');
var AlbumsActions = require('../../actions/AlbumsActions');
var AlbumsStore = require('../../stores/AlbumsStore');
var Button = require('react-bootstrap').Button;
var Modal = require('react-bootstrap').Modal;
var TextInput = require('../account/textInput');
var ChooseCategory = require('./chooseCategory');
var validator = require('validator');

var EditAlbumModal = React.createClass({
  mixins: [Reflux.listenTo(AlbumsStore, 'onStoreChanged')],
  getInitialState: function () {
    return {
      categories: null,
      isInfoShow: false,
      album: null,
    }
  },
  getDefaltProps: function () {
    return {
      value: 0,
      onChange: function (data) {
      },
    }
  },
  componentWillMount: function () {
    this.setState({album: this.props.album});
  },
  showInfoModal() {
    this.setState({isInfoShow: true});
  },
  hideInfoModal() {
    this.setState({isInfoShow: false});
  },
  updateTitle: function (title) {
    var album = this.state.album;
    album.Title = title
    this.setState({album: album});
  },
  updateCategory: function (cid) {
    var album = this.state.album;
    album.CategoryId = cid
    this.setState({album: album});
  },
  updateDescription: function (des) {
    var album = this.state.album;
    album.Description = des
    this.setState({album: album});
  },
  updateService: function (service) {
    var album = this.state.album;
    album.Service = service
    this.setState({album: album});
  },
  updatePrice: function (price) {
    var album = this.state.album;
    album.Price = price
    this.setState({album: album});
  },
  validate: function () {
    if (this.state.album.Title.length < 5 || this.state.album.Title.length > 25) {
      this.showMessage('作品名称必须在1-20字之间');
      return false;
    }
    if (!this.state.album.CategoryId) {
      this.showMessage('请选择作品类别');
      return false;
    }
    if (this.state.album.Description.length < 15 || this.state.album.Description.length > 1000) {
      this.showMessage('作品描述必须在15-1000字之间');
      return false;
    }
    if (this.state.album.Service.length < 15 || this.state.album.Service.length > 1000) {
      this.showMessage('服务描述必须在15-1000字之间');
      return false;
    }
    if (this.state.album.Price && !validator.isInt(this.state.album.Price)) {
      this.showMessage('如果填写价格，必须为数字');
      return false;
    }
    return true;
  },
  handleSubmit: function () {
    if (this.validate()) {
      var album = this.state.album;
      album.Negotiable = this.state.album.Price == 0 ? true : false;
      AlbumsActions.update(album);
      this.hideInfoModal();
    }
  },
  render: function () {
    return (
      <div>
        <Button bsStyle="primary" onClick={this.showInfoModal}>
          修改信息
        </Button>
        <Modal
          show={this.state.isInfoShow}
          onHide={this.hideInfoModal}
          dialogClassName="custom-modal">
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-lg">Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className='form-horizontal'>
              <TextInput ref="workName"
                         labelName="作品名称："
                         value={this.state.album.Title}
                         updateValue={this.updateTitle}
                         minLength={5}
                         placeholder="名称应该在1-20字之间"/>
              <ChooseCategory value={this.state.album.CategoryId} categories={this.props.categories}
                              onChange={this.updateCategory}/>
              <TextInput ref="workDescription"
                         type="textarea"
                         value={this.state.album.Description}
                         updateValue={this.updateDescription}
                         labelName="作品简述："
                         minLength={15}
                         maxLength={1000}
                         placeholder=""
                         help="作品描述应该在15-1000字之间"/>
              <TextInput ref="service"
                         type="textarea"
                         value={this.state.album.Service}
                         updateValue={this.updateService}
                         labelName="提供服务："
                         minLength={15}
                         maxLength={1000}
                         placeholder=""
                         help="服务描述应该在15-1000字之间"/>
              <TextInput ref="price"
                         labelName="是否定价："
                         textClassName="col-xs-4"
                         value={this.state.album.Price}
                         updateValue={this.updatePrice}
                         placeholder="¥面议"/>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleSubmit}>提交</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
});

module.exports = EditAlbumModal;