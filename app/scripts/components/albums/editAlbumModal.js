var React = require('react');
var Reflux = require('reflux');
var AlbumsActions = require('../../actions/AlbumsActions');
var AlbumsStore = require('../../stores/AlbumsStore');
var Button = require('react-bootstrap').Button;
var Modal = require('react-bootstrap').Modal;
var TextInput = require('../account/textInput');
var ChooseTags = require('../chooseTags');
var validator = require('validator');

var EditAlbumModal = React.createClass({
  mixins: [Reflux.listenTo(AlbumsStore, 'onStoreChanged')],
  getInitialState: function () {
    return {
      categories: null,
      show: false,
      album: null,
      submit: false
    }
  },
  getDefaltProps: function () {
    return {
      value: 0,
      onChange: function (data) {
      },
    }
  },
  onStoreChanged : function (data) {
    if(data.flag == 'update' && data.hintMessage == '') {
      this.loadAlbums(this.state.album.Id)
    }
    if(data.flag == 'get') {
      this.setState({album: data.workData});
      this.setState({submit:false});
    }
    if(data.flag == 'onSale' || data.flag == 'offSale' ){
      console.log(data.hintMessage)
      console.log(data.hintMessage == '')
      if (data.hintMessage == '') {
        var album = this.state.album;
        album.Display = !album.Display
        this.setState(album)
      }
    }
  },
  componentWillMount: function () {
    this.setState({album: this.props.album});
  },
  componentWillReceiveProps : function (nextProps) {
    this.setState({show:nextProps.show,album: nextProps.album})
  },
  loadAlbums: function (id) {
    var data = {
      Fields: 'Id,Title,UserId,Service,Price,CategoryId,CreationTime,EditingTime,Display,Description,Cover,Photos.Id,Photos.Url,State,CreationTime,EditingTime,Tags.Id,Tags.Name',
      Id: id,
    };
    AlbumsActions.get(data)
  },
  hideInfoModal: function () {
    this.setState({show: false});
    this.props.hideHandle()
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
  updateTags : function(tags){
    var album = this.state.album;
    album.Tags = tags.join(',')
    this.setState({album: album});
    console.log('updateTags:', tags);
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
      this.props.showMessage('作品名称必须在1-20字之间');
      return false;
    }
    if (!this.state.album.CategoryId) {
      this.props.showMessage('请选择作品类别');
      return false;
    }
    if (this.state.album.Description.length < 15 || this.state.album.Description.length > 1000) {
      this.props.showMessage('作品描述必须在15-1000字之间');
      return false;
    }
    if (this.state.album.Service.length < 15 || this.state.album.Service.length > 1000) {
      this.props.showMessage('服务描述必须在15-1000字之间');
      return false;
    }
    if (!validator.isInt(this.state.album.Price) && parseInt(this.state.album.Price) > 0) {
      this.props.showMessage('如果填写价格，必须为数字');
      return false;
    }
    return true;
  },
  handleSubmit: function () {
    if (this.validate()) {
      var album = this.state.album;
      AlbumsActions.update(album);
      this.hideInfoModal();
      this.setState({submit:true});
    }
  },
  displayHandle: function (display) {
    console.log(typeof display)
    if(this.state.album.Display != display){
      if(display == 'true'){
        AlbumsActions.onSale({Id:this.state.album.Id})
      }else{
        AlbumsActions.offSale({Id:this.state.album.Id})
      }
    }
  },
  render: function () {
    return (
      <div>
        <Modal
          show={this.state.show}
          onHide={this.hideInfoModal}
          dialogClassName="custom-modal">
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-lg">修改信息</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className='form-horizontal'>
              <TextInput ref="workName"
                         labelName="作品名称："
                         value={this.state.album.Title}
                         updateValue={this.updateTitle}
                         minLength={5}
                         placeholder="名称应该在1-20字之间"/>
              <ChooseTags value={this.state.album.Tags} onChange={this.updateTags} categories={this.props.categories}/>
              <TextInput ref="workDescription"
                         type="textarea"
                         value={this.state.album.Description}
                         updateValue={this.updateDescription}
                         labelName="作品简述："
                         minLength={15}
                         maxLength={1000}
                         placeholder=""
                         help="作品描述应该在15-1000字之间"
                         style={{'min-height':100}}/>
              <TextInput ref="service"
                         type="textarea"
                         value={this.state.album.Service}
                         updateValue={this.updateService}
                         labelName="提供服务："
                         minLength={15}
                         maxLength={1000}
                         placeholder=""
                         help="服务描述应该在15-1000字之间"
                         style={{'min-height':230}}/>
              <TextInput ref="price"
                         labelName="是否定价："
                         textClassName="col-xs-4"
                         value={this.state.album.Price}
                         updateValue={this.updatePrice}
                         placeholder="¥面议"/>
              <DisplayCheckbox value={this.state.album.Display} onChange={this.displayHandle}/>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleSubmit} disabled={this.state.submit}>提交</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
});

module.exports = EditAlbumModal;

/*
 选择类别组件
 */
var DisplayCheckbox = React.createClass({
  getInitialState : function(){
    return {
      values : [{
        Id:true,
        Name:"上架"
      },{
        Id:false,
        Name:"下架"
      }]
    }
  },
  getDefaltProps : function(){
    return {
      value : 0,
      onChange : function(data){},
    }
  },
  setCategory : function(event){
    this.props.onChange(event.target.getAttribute('data-value'));
  },
  render : function(){
    var style = {
      button: {
        width: '90px',
        height: '32px',
        marginRight: '9px',
        marginBottom: '10px',
      }
    }

    //目前没有做排序和是否显示
    var buttons = this.state.values.map(function(item,i){
      return(<Button key={i} bsStyle={this.props.value==item.Id?'primary':'default'} style={style.button} onClick={this.setCategory} data-value={item.Id}>{item.Name}</Button>);
    }.bind(this));
    return (
        <div className="form-group">
          <div className="col-xs-12">
            <div className="cont-category" style={{textAlign:'center'}}>
              {buttons}
            </div>
          </div>
        </div>
    );
  }
});