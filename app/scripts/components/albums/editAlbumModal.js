var React = require('react');
var Reflux = require('reflux');
var AlbumsActions = require('../../actions/AlbumsActions');
var AlbumsStore = require('../../stores/AlbumsStore');
var Button = require('react-bootstrap').Button;
var Modal = require('react-bootstrap').Modal;
var TextInput = require('../account/textInput');
var ChooseTags = require('../chooseTags');
var validator = require('validator');
var Switch = require('../tools/switch');

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
      if(this.state.submit){
        this.props.showMessage('修改成功');
      }
      this.props.uploadHandle();
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
  updateOriginalSupport : function(originalSupport){
    var album = this.state.album;
    album['Detail.OriginalSupport'] = originalSupport;
    this.setState({album: album});
  },
  updatePhysicalSupport : function(physicalSupport){
    this.setState({physicalSupport : physicalSupport});
    var album = this.state.album;
    album['Detail.PhysicalSupport'] = physicalSupport;
    this.setState({album: album});
  },
  updatePlateCount : function(plateCount){
    var album = this.state.album;
    album['Detail.PlateCount'] = plateCount;
    this.setState({album: album});
  },
  updateTruingCount : function(truingCount){
    var album = this.state.album;
    album['Detail.TruingCount'] = truingCount;
    this.setState({album: album});
  },
  updateMakeUpSupport : function(makeUpSupport){
    var album = this.state.album;
    album['Detail.MakeUpSupport'] = makeUpSupport;
    this.setState({album: album});
  },
  updateCostumeCount : function(costumeCount){
    var album = this.state.album;
    album['Detail.CostumeCount'] = costumeCount;
    this.setState({album: album});
  },
  updatePeopleCount : function(peopleCount){
    var album = this.state.album;
    album['Detail.PeopleCount'] = peopleCount;
    this.setState({album: album});
  },
  updateUnitCount : function(unitCount){
    var album = this.state.album;
    album['Detail.UnitCount'] = unitCount;
    this.setState({album: album});
  },
  updateSceneCount : function(sceneCount){
    var album = this.state.album;
    album['Detail.SceneCount'] = sceneCount;
    this.setState({album: album});
  },
  updateDuration : function(duration){
    var album = this.state.album;
    album['Detail.Duration'] = duration;
    this.setState({album: album});
  },
  updatePhysicalDetail : function(physicalDetail){
    var album = this.state.album;
    album['Detail.PhysicalDetail'] = physicalDetail;
    this.setState({album: album});
  },
  updateSeatCount : function(seatCount){
    var album = this.state.album;
    album['Detail.SeatCount'] = seatCount;
    this.setState({album: album});
  },
  updatePlaceType : function(placeType){
    var album = this.state.album;
    album['Detail.PlaceType'] = placeType;
    this.setState({album: album});
  },
  validate: function () {
    if (this.state.album.Title.length < 1 || this.state.album.Title.length > 20) {
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
      if((typeof album.Tags =='object') && album.Tags.constructor==Array){
        album.Tags = album.Tags.map(function (item) {
          return item.Id
        }).join(',')
      }
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
    var physicalDetail = this.state.physicalSupport ?
      (<TextInput ref="physicalDetail"
                  labelName="实体产品提供详情："
                  textClassName="col-xs-4"
                  value={this.state.physicalDetail}
                  updateValue={this.updatePhysicalDetail}
                  placeholder=""/>):'';
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
                         minLength={1}
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
                         style={{minHeight:100}}/>
              <TextInput ref="duration"
                         labelName="拍摄时长："
                         textClassName="col-xs-4"
                         value={this.state.album.Duration}
                         updateValue={this.updateDuration}
                         placeholder=""/>
              <TextInput ref="plateCount"
                         labelName="底片张数："
                         textClassName="col-xs-4"
                         value={this.state.album.PlateCount}
                         updateValue={this.updatePlateCount}
                         placeholder=""/>
              <TextInput ref="truingCount"
                         labelName="精修张数："
                         textClassName="col-xs-4"
                         value={this.state.album.TruingCount}
                         updateValue={this.updateTruingCount}
                         placeholder=""/>
              <TextInput ref="costumeCount"
                         labelName="服装数目："
                         textClassName="col-xs-4"
                         value={this.state.album.CostumeCount}
                         updateValue={this.updateCostumeCount}
                         placeholder=""/>
              <Switch ref="makeUpSupport"
                      label='化妆造型'
                      textOn='提供'
                      textOff='不提供'
                      checked={this.state.album.MakeUpSupport}
                      onChange={this.updateMakeUpSupport}/>
              <Switch ref="originalSupport"
                      label='原片'
                      textOn='全送'
                      textOff='不送'
                      checked={this.state.album.OriginalSupport}
                      onChange={this.updateOriginalSupport}/>
              <Switch ref="physicalSupport"
                      label='实体产品'
                      textOn='提供'
                      textOff='不提供'
                      checked={this.state.album.PhysicalSupport}
                      onChange={this.updatePhysicalSupport}/>
              {physicalDetail}
              <TextInput ref="unitCount"
                         labelName="拍摄几组："
                         textClassName="col-xs-4"
                         value={this.state.album.UnitCount}
                         updateValue={this.updateUnitCount}
                         placeholder=""/>
              <TextInput ref="sceneCount"
                         labelName="拍摄场景数量："
                         textClassName="col-xs-4"
                         value={this.state.album.SceneCount}
                         updateValue={this.updateSceneCount}
                         placeholder=""/>
              <TextInput ref="peopleCount"
                         labelName="被拍摄人数："
                         textClassName="col-xs-4"
                         value={this.state.album.PeopleCount}
                         updateValue={this.updatePeopleCount}
                         placeholder=""/>
              <TextInput ref="seatCount"
                         labelName="拍摄机位："
                         textClassName="col-xs-4"
                         value={this.state.album.SeatCount}
                         updateValue={this.updateSeatCount}
                         placeholder=""/>
              <TextInput ref="placeType"
                         labelName="拍摄场地："
                         textClassName="col-xs-4"
                         value={this.state.album.PlaceType}
                         updateValue={this.updatePlaceType}
                         placeholder=""/>
              <TextInput ref="service"
                         type="textarea"
                         value={this.state.album.Service}
                         updateValue={this.updateService}
                         labelName="补充说明："
                         minLength={15}
                         maxLength={1000}
                         placeholder=""
                         help="服务描述应该在15-1000字之间"
                         style={{minHeight:100}}/>
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