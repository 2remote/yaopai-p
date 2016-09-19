var React = require('react');
var Reflux = require('reflux');
var AlbumsActions = require('../../actions/AlbumsActions');
import AlbumAction from 'photographer/actions/AlbumAction'
var AlbumsStore = require('../../stores/AlbumsStore');
var Button = require('react-bootstrap').Button;
var Modal = require('react-bootstrap').Modal;
var TextInput = require('../account/textInput');
var ChooseTags = require('../chooseTags');
var validator = require('validator');
var Switch = require('../tools/switch');
var ToolTip = require('../toolTip');
var Checkbox = require('../tools/checkbox');
import $ from 'jquery';

import ImageOptimus from '../upai/ImageOptimus'

var EditAlbumModal = React.createClass({
  mixins: [Reflux.listenTo(AlbumsStore, 'onStoreChanged')],
  getInitialState: function () {
    return {
      categories: [],
      show: false,
      album: null,
      submit: false,
      allTags : [],
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
      if (data.hintMessage == '') {
        var album = this.state.album;
        album.Display = !album.Display
        this.setState(album)
      }
    }
    if(data.flag == 'getTagList'){
      //获取所有的标签列表值
      this.setState({"allTags" : data.tags});
    }
  },
  componentWillMount: function () {
    console.log("componentWillMount:00000",this.props)
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
    this.setState({album: album});
  },
  updateTags : function(tags){
    var album = this.state.album;
    album.Tags = tags.join(',');
    this.setState({album: album});
  },
  updateCover : function(cover){
    var album = this.state.album;
    album.Cover = cover
    this.setState({album : album});
    console.log("success")
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
    album.Detail.OriginalSupport = originalSupport;
    this.setState({album: album});
  },
  updatePhysicalSupport : function(physicalSupport){
    var album = this.state.album;
    album.Detail.PhysicalSupport = physicalSupport;
    this.setState({album: album});
  },
  updatePlateCount : function(plateCount){
    var album = this.state.album;
    album.Detail.PlateCount = plateCount;
    this.setState({album: album});
  },
  updateTruingCount : function(truingCount){
    var album = this.state.album;
    album.Detail.TruingCount = truingCount;
    this.setState({album: album});
  },
  updateMakeUpSupport : function(makeUpSupport){
    var album = this.state.album;
    album.Detail.MakeUpSupport = makeUpSupport;
    this.setState({album: album});
  },
  updateCostumeCount : function(costumeCount){
    var album = this.state.album;
    album.Detail.CostumeCount = costumeCount;
    this.setState({album: album});
  },
  updatePeopleCount : function(peopleCount){
    var album = this.state.album;
    album.Detail.PeopleCount = peopleCount;
    this.setState({album: album});
  },
  updateUnitCount : function(unitCount){
    var album = this.state.album;
    album.Detail.UnitCount = unitCount;
    this.setState({album: album});
  },
  updateSceneCount : function(sceneCount){
    var album = this.state.album;
    album.Detail.SceneCount = sceneCount;
    this.setState({album: album});
  },
  updateDuration : function(duration){
    var album = this.state.album;
    album.Detail.Duration = duration;
    this.setState({album: album});
  },
  updatePhysicalDetail : function(physicalDetail){
    var album = this.state.album;
    album.Detail.PhysicalDetail = physicalDetail;
    this.setState({album: album});
  },
  updateSeatCount : function(seatCount){
    var album = this.state.album;
    album.Detail.SeatCount = seatCount;
    this.setState({album: album});
  },
  updatePlaceType : function(placeType){
    var album = this.state.album;
    album.Detail.PlaceType = placeType;
    this.setState({album: album});
  },
  validate: function () {
    console.log(this.refs.placeType.state.selectedValues)
    if($.trim(this.state.album.Title).length < 1 || $.trim(this.state.album.Title).length > 20){
      React.findDOMNode(this.refs.workName.refs.input.refs.input).focus();
      this.showMessage('作品名称必须在1-20字之间');
      return false;
    }

    //=====================
    var tag1=[],tag2=[],tag3 =[];
    var n1=0,n2=0,n3=0;

    //获得全部标签并放入state
    AlbumsActions.getTagList();
    //获取已选标签数组
    var selectedArr=[];
    var tag = this.state.album.Tags;
    if(typeof(tag)=="object"){
      for(var i in tag) {
        selectedArr.push(tag[i].Id);
      }
    }else{
      var arrs = tag.split(',');
      for(var k in arrs){
        selectedArr.push(parseInt(arrs[k]));
      }
    }

    //比对state中的全部标签和已选标签
    var arr = this.state.allTags;
    //获取所有标签集合tag1~3
    for(var i=0;i<arr.length;i++){
      for(var j=0;j<arr[i].Tags.length;j++){
        if(i==0){
          tag1.push(arr[i].Tags[j].Id);
        }
        if(i==1){
          tag2.push(arr[i].Tags[j].Id);
        }
        if(i==2){
          tag3.push(arr[i].Tags[j].Id);
        }
      }
    }

    //判断所选元素是否在allTags[0]数组中
    if(selectedArr.length==0){
      this.showMessage('请选择类别标签');
      return false;
    }else{
      for(var i =0;i<selectedArr.length;i++){
        if(tag1.indexOf(selectedArr[i])>=0){n1++;}
        if(tag2.indexOf(selectedArr[i])>=0){n2++;}
        if(tag3.indexOf(selectedArr[i])>=0){n3++;}
      }
      if(n1==0){
        this.showMessage('请选择类别标签');
        return false;
      }else if(n2==0){
        this.showMessage('请选择可服务拍摄地标签');
        return false;
      }else if(n3==0){
        this.showMessage('请选择风格标签');
        return false;
      }
    }
    //=====================

    if($.trim(this.state.album.Description).length < 15 || $.trim(this.state.album.Description).length > 1000){
      this.showMessage('作品描述必须在15-1000字之间');
      React.findDOMNode(this.refs.workDescription.refs.input.refs.input).focus();
      return false;
    }
    if(this.state.album.Detail.Duration.length <= 0){
      this.showMessage('拍摄时长不能为空');
      React.findDOMNode(this.refs.duration.refs.input.refs.input).focus();
      return false;
    }
    if(!validator.isInt($.trim(this.state.album.Detail.PlateCount)) || parseInt(this.state.album.Detail.PlateCount) <= 0){
      this.showMessage('底片张数必须大于0');
      React.findDOMNode(this.refs.plateCount.refs.input.refs.input).focus();
      return false;
    }
    if(!validator.isInt($.trim(this.state.album.Detail.TruingCount)) || parseInt(this.state.album.Detail.TruingCount) < 0){
      this.showMessage('精修张数仅限数字,且不能为空');
      React.findDOMNode(this.refs.truingCount.refs.input.refs.input).focus();
      return false;
    }
    if(!validator.isInt($.trim(this.state.album.Detail.CostumeCount)) || parseInt(this.state.album.Detail.CostumeCount) < 0){
      this.showMessage('服装数目仅限数字,且不能为空');
      React.findDOMNode(this.refs.costumeCount.refs.input.refs.input).focus();
      return false;
    }
    if(!validator.isInt($.trim(this.state.album.Detail.UnitCount)) || parseInt(this.state.album.Detail.UnitCount) <= 0){
      this.showMessage('拍摄组数仅限大于0的数字,且不能为空');
      React.findDOMNode(this.refs.unitCount.refs.input.refs.input).focus();
      return false;
    }
    if(!validator.isInt($.trim(this.state.album.Detail.SceneCount)) || parseInt(this.state.album.Detail.SceneCount) <= 0){
      this.showMessage('拍摄场景数量仅限大于0的数字,且不能为空');
      React.findDOMNode(this.refs.sceneCount.refs.input.refs.input).focus();
      return false;
    }
    if(!validator.isInt($.trim(this.state.album.Detail.PeopleCount)) || parseInt(this.state.album.Detail.PeopleCount) < 0){
      this.showMessage('被拍摄人数仅限数字,且不能为空');
      React.findDOMNode(this.refs.peopleCount.refs.input.refs.input).focus();
      return false;
    }
    if(!validator.isInt($.trim(this.state.album.Detail.SeatCount)) || parseInt(this.state.album.Detail.SeatCount) <= 0){
      this.showMessage('拍摄机位仅限大于0的数字,且不能为空');
      React.findDOMNode(this.refs.seatCount.refs.input.refs.input).focus();
      return false;
    }
    var placeType = this.refs.placeType.state.selectedValues
    if(placeType.length==0){
      this.showMessage('拍摄场地不能为空');
      return false;
    }else if(placeType.length==1 && placeType[0]=="Null"){
      this.showMessage('拍摄场地不能为空');
      return false;
    }
    if(this.state.album.Service && $.trim(this.state.album.Service).length > 1000){
      this.showMessage('补充服务说明不超过1000字');
      React.findDOMNode(this.refs.service.refs.input.refs.input).focus();
      return false;
    }
    if(!validator.isFloat($.trim(this.state.album.Price)) || parseFloat($.trim(this.state.album.Price)) < 1){
      this.showMessage('价格仅限大于等于1的数字,且不能为空');
      React.findDOMNode(this.refs.price.refs.input.refs.input).focus();
      return false;
    }

    return true;
  },
  showMessage : function(message){
    this.refs.toolTip.toShow(message);
  },
  handleSubmit: function (e) {
    e && e.preventDefault && e.preventDefault()
    if (this.validate()) {
      var album = this.state.album;
      if((typeof album.Tags =='object') && album.Tags.constructor==Array){
        // 直接动this.state里的数据么？
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
    var placeType = this.state.album.Detail.PlaceType;
    if(typeof this.state.album.Detail.PlaceType =='string') {
      placeType = this.state.album.Detail.PlaceType.split(',');
      //去掉前后空格
      placeType = placeType.map(function (item) {
        item=item.replace(/(^\s*)|(\s*$)/g, "");
        console.log(item)
        return item;
      });
      //end
    }
    var placeTypeData = [
      {
        key:'Studio',
        value:'影棚'
      },{
        key:'Exterior',
        value:'外景'
      },{
        key:'Interior',
        value:'室内'
      }
    ]
    var physicalDetail = this.state.album.Detail.PhysicalSupport ?
      (<TextInput ref="physicalDetail"
                  labelName="实体产品提供详情："
                  textClassName="col-xs-4"
                  value={this.state.album.Detail.PhysicalDetail}
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
            <div style={{fontSize:'12px',lineHeight:'30px',background:'#f5f5f5',border:'1px dashed #e4e4e4',color:'#000',padding:'15px 20px',margin: '-15px 0 30px 0'}}>
              <b>作品上传注意事项</b><br />
              1、作品名称、简述、补充说明以及每一张图片上均不能出现摄影师的微博、微信、QQ、电话等联系方式<br />
              2、每套作品至少上传 6 张图片，单张图片不能超过 10M；建议不要将多图排版编辑到一张图片中<br />
              3、除「补充服务说明 」为非必填项外，其他都为必填项， 请认真填写服务详情，方便客户的选择和预约
            </div>
            <form className='form-horizontal'>
              <TextInput ref="workName"
                         labelName="作品名称："
                         value={this.state.album.Title}
                         updateValue={this.updateTitle}
                         minLength={1}
                         placeholder="名称应该在1-20字之间"/>
              <div className="form-group" ref="cover">
                <div className="col-xs-3 text-right">
                  <label className="control-label">上传封面：<br />（宽度不得超过2000）</label>
                </div>
                <div className="col-xs-8">
                  <ImageOptimus
                    onUploadSucceed={ this.updateCover } cover={ this.state.album.Cover }
                  />
                </div>
              </div>
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
                         value={this.state.album.Detail.Duration}
                         updateValue={this.updateDuration}
                         placeholder="如：3小时 或 3天 (请标注时间单位)"/>
              <TextInput ref="plateCount"
                         labelName="底片张数："
                         textClassName="col-xs-4"
                         value={this.state.album.Detail.PlateCount}
                         updateValue={this.updatePlateCount}
                         placeholder="请填写数字，如 100"/>
              <TextInput ref="truingCount"
                         labelName="精修张数："
                         textClassName="col-xs-4"
                         value={this.state.album.Detail.TruingCount}
                         updateValue={this.updateTruingCount}
                         placeholder="请填写数字，如 20"/>
              <TextInput ref="costumeCount"
                         labelName="服装数目："
                         textClassName="col-xs-4"
                         value={this.state.album.Detail.CostumeCount}
                         updateValue={this.updateCostumeCount}
                         placeholder="请填写数字，如 2；如不提供服装请填写 0"/>
              <Switch ref="makeUpSupport"
                      label='化妆造型'
                      textOn='提供'
                      textOff='不提供'
                      checked={this.state.album.Detail.MakeUpSupport}
                      onChange={this.updateMakeUpSupport}/>
              <Switch ref="originalSupport"
                      label='原片'
                      textOn='全送'
                      textOff='不送'
                      checked={this.state.album.Detail.OriginalSupport}
                      onChange={this.updateOriginalSupport}/>
              <Switch ref="physicalSupport"
                      label='实体产品'
                      textOn='提供'
                      textOff='不提供'
                      checked={this.state.album.Detail.PhysicalSupport}
                      onChange={this.updatePhysicalSupport}/>
              {physicalDetail}
              <TextInput ref="unitCount"
                         labelName="拍摄几组："
                         textClassName="col-xs-4"
                         value={this.state.album.Detail.UnitCount}
                         updateValue={this.updateUnitCount}
                         placeholder="请填写数字，如 3"/>
              <TextInput ref="sceneCount"
                         labelName="拍摄场景数量："
                         textClassName="col-xs-4"
                         value={this.state.album.Detail.SceneCount}
                         updateValue={this.updateSceneCount}
                         placeholder="请填写数字，如 3"/>
              <TextInput ref="peopleCount"
                         labelName="被拍摄人数："
                         textClassName="col-xs-4"
                         value={this.state.album.Detail.PeopleCount}
                         updateValue={this.updatePeopleCount}
                         placeholder="请填写数字,如 1"/>
              <TextInput ref="seatCount"
                         labelName="拍摄机位："
                         textClassName="col-xs-4"
                         value={this.state.album.Detail.SeatCount}
                         updateValue={this.updateSeatCount}
                         placeholder="请填写数字,如 1"/>
              <Checkbox labelName="拍摄场地：" ref="placeType" value={placeType} data={placeTypeData} onChange = {this.updatePlaceType}/>
              <TextInput ref="service"
                         type="textarea"
                         value={this.state.album.Service}
                         updateValue={this.updateService}
                         labelName="补充服务说明："
                         maxLength={1000}
                         placeholder=""
                         help="(非必填) 补充服务说明不超过1000字"
                         style={{minHeight:100}}/>
              <TextInput ref="price"
                         labelName="套系价格："
                         textClassName="col-xs-4"
                         value={this.state.album.Price}
                         updateValue={this.updatePrice}
                         placeholder="¥(单位:元)"/>
              <DisplayCheckbox value={this.state.album.Display} onChange={this.displayHandle}/>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleSubmit} disabled={this.state.submit}>提交</Button>
          </Modal.Footer>
        </Modal>
        <ToolTip ref="toolTip" title=""/>
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
