var _ = require('lodash');
var React = require('react');
var Reflux = require('reflux');
var ReactAddons = require('react/addons');
var validator = require('validator');
var Panel = require('react-bootstrap').Panel;
var Button = require('react-bootstrap').Button;

var assert = require('assert');

var InfoHeader= require('./infoHeader');
var TextInput = require('./account/textInput');
var ChooseImage = require('./account/chooseImage');
var ToolTip = require('./toolTip');

var AlbumsStore = require('../stores/AlbumsStore');
// assert(AlbumsStore, 'store is ok'+ AlbumsStore);

var AlbumsActions = require('../actions/AlbumsActions');
var WorkStore = require('../stores/WorkStore');
var UserActions = require("../actions/UserActions");
var UserStore = require("../stores/UserStore");
import { History } from 'react-router'
var ChooseTags = require('./chooseTags');
var Switch = require('./tools/switch');
var Checkbox = require('./tools/checkbox');

import { ROUTE_LOGIN } from '../routeConfig'

import ImageOptimus from './upai/ImageOptimus'

/*
  上传作品组件
  用到通用的用户组件 ./account/*
    AccountHeader
    TextInput
  注意事项：
  1.只有认证为摄影师后才能上传作品，否则上传接口会报错。应该判断用户类型，如果用户不是摄影师，跳转到摄影师认证。
  2.tags在第一版先不做。
  3. 在这个界面可以增加，修改相册
*/
var UploadWorks = React.createClass({
  mixins : [Reflux.listenTo(AlbumsStore,'onStoreChanged'),Reflux.listenTo(WorkStore,'onWorkStoreChange'),Reflux.listenTo(UserStore, 'isLogin'), History],
  getInitialState : function(){
    return {
      title : '',
      category : '',
      description : '',
      service : '',
      price : 0 ,
      plateCount : 0 ,
      truingCount : 0 ,
      costumeCount : 0 ,
      unitCount : 0 ,
      sceneCount : 0 ,
      peopleCount : 0 ,
      seatCount : 0 ,
      cover : -1,
      cut : '',
      photos : [],
      tags : 0,
      submit: false
    }
  },
  isLogin: function (data) {
    if (!data.isLogin) {
      //没有登录跳转到首页登录界面
      UserActions.logout(true);
      this.history.pushState(null, ROUTE_LOGIN);
    }
  },
  onStoreChanged : function(data){
    if(data.flag == 'add'){
      console.log(data);
      if(data.hintMessage){
        this.showMessage(data.hintMessage)
      }else{
        this.showMessage('上传成功，您可以继续上传');
        //清空数据
        this.setState({
          title : '',
          category : '',
          description : '',
          service : '',
          price : 0 ,
          plateCount : 0 ,
          truingCount : 0 ,
          costumeCount : 0 ,
          unitCount : 0 ,
          sceneCount : 0 ,
          peopleCount : 0 ,
          seatCount : 0 ,
          cover : -1,
          cut : '',
          photos : [],
          tags : []
        });
        //同时要清空WorkStore的数据
        this.refs.chooseImage.clearImage();
        this.history.replaceState(null, ROUTE_LOGIN);
      }
    }
    if(data.flag == 'get'){
      //处理get请求结果
    }
    if(data.flag == 'update'){
      //处理更新后的结果
    }
  },
  onWorkStoreChange : function(data){
    if(data.flag == 'onSetCut'){
      this.setState({cut : data.cut});
    }else{
      //处理封面
      var cover = -1;
      for(var i =0 ; i < data.length ; i ++){
        if(data[i].isCover) cover = i;
      }
      this.setState({photos : data,cover : cover});
    }
  },
  updateTitle : function(title){
    this.setState({title: title});
  },
  updatePhotos : function(photos){
    this.setState({photos : photos});
  },
  updateTags : function(tags){
    this.setState({tags : tags}, function () {
      console.log('updateTags:', this.state.tags);
    });
  },
  updateDescription : function(des){
    this.setState({description : des});
  },
  updateService : function(service){
    this.setState({service : service});
  },
  updatePrice : function(price){
    this.setState({price : price});
  },
  updateCover : function(cover){
    this.setState({cover : cover});
  },
  updateOriginalSupport : function(originalSupport){
    this.setState({originalSupport : originalSupport});
  },
  updatePhysicalSupport : function(physicalSupport){
    this.setState({physicalSupport : physicalSupport});
  },
  updatePlateCount : function(plateCount){
    this.setState({plateCount : plateCount});
  },
  updateTruingCount : function(truingCount){
    this.setState({truingCount : truingCount});
  },
  updateMakeUpSupport : function(makeUpSupport){
    this.setState({makeUpSupport : makeUpSupport});
  },
  updateCostumeCount : function(costumeCount){
    this.setState({costumeCount : costumeCount});
  },
  updatePeopleCount : function(peopleCount){
    this.setState({peopleCount : peopleCount});
  },
  updateUnitCount : function(unitCount){
    this.setState({unitCount : unitCount});
  },
  updateSceneCount : function(sceneCount){
    this.setState({sceneCount : sceneCount});
  },
  updateDuration : function(duration){
    this.setState({duration : duration});
  },
  updatePhysicalDetail : function(physicalDetail){
    this.setState({physicalDetail : physicalDetail});
  },
  updateSeatCount : function(seatCount){
    this.setState({seatCount : seatCount});
  },
  updatePlaceType : function(placeType){
    this.setState({placeType : placeType});
  },
  validate : function(){
    if(this.state.title.length < 1 || this.state.title.length > 20){
      this.showMessage('作品名称必须在1-20字之间');
      return false;
    }
    if(this.state.photos.length == 0){
      this.showMessage('请至少上传一张作品');
      return false;
    }
    if(!this.state.tags.length>0){
      this.showMessage('请选择作品类别');
      assert(this.state.tags.length > 0, 'Number of tags should bigger than 0, but we have:' + this.state.tags);
      return false;
    }
    if(this.state.description.length < 15 || this.state.description.length > 1000){
      this.showMessage('作品描述必须在15-1000字之间');
      return false;
    }
    if(this.state.service && this.state.service.length > 1000){
      this.showMessage('补充说明不超过1000字');
      return false;
    }
    if(!validator.isInt(this.state.price) || parseInt(this.state.price) <= 0){
      this.showMessage('如果填写价格，必须为数字');
      return false;
    }
    /*
    if(!validator.isInt(this.state.plateCount) || parseInt(this.state.plateCount) <= 0){
      this.showMessage('如果填写底片张数，必须为数字');
      return false;
    }
    if(!validator.isInt(this.state.truingCount) || parseInt(this.state.truingCount) <= 0){
      this.showMessage('如果填写精修张数，必须为数字');
      return false;
    }
    if(!validator.isInt(this.state.costumeCount) || parseInt(this.state.costumeCount) <= 0){
      this.showMessage('如果填写服装数目，必须为数字');
      return false;
    }
    if(!validator.isInt(this.state.unitCount) || parseInt(this.state.unitCount) <= 0){
      this.showMessage('如果填写拍摄几组，必须为数字');
      return false;
    }
    if(!validator.isInt(this.state.sceneCount) || parseInt(this.state.sceneCount) <= 0){
      this.showMessage('如果填写拍摄场景数量，必须为数字');
      return false;
    }
    if(!validator.isInt(this.state.peopleCount) || parseInt(this.state.peopleCount) <= 0){
      this.showMessage('如果填写被拍摄人数，必须为数字');
      return false;
    }
    if(!validator.isInt(this.state.seatCount) || parseInt(this.state.seatCount) <= 0){
      this.showMessage('如果填写拍摄机位，必须为数字');
      return false;
    }
    */
    if(this.state.cover < 0 ){
      this.showMessage('请选择一张作品作为封面');
      return false;
    }
    return true;
  },
  handleSubmit : function(){
    if(this.validate()){
      var data = {
        Title : this.state.title,
        Description : this.state.description,
        Service : this.state.service,
        Price : this.state.price,
        Negotiable : this.state.price==0?true:false,
        Cover : this.state.photos[this.state.cover].Url,
        Cut: this.state.cut?this.state.cut:'',
        Tags: this.state.tags.join(','),
        Detail: {
          Duration: this.state.duration,//拍摄时长
          PlateCount: this.state.plateCount,//底片张数
          TruingCount: this.state.truingCount,//精修张数
          CostumeCount: this.state.costumeCount,//服装数目
          MakeUpSupport: this.state.makeUpSupport,//化妆造型
          OriginalSupport: this.state.originalSupport,//送原片
          PhysicalSupport: this.state.physicalSupport,//提供实体产品
          PhysicalDetail: this.state.physicalDetail,//实体产品提供详情
          UnitCount: this.state.unitCount,//拍摄几组
          SceneCount: this.state.sceneCount,//拍摄场景数量
          PeopleCount: this.state.peopleCount,//被拍摄人数
          SeatCount: this.state.seatCount,//拍摄机位
          PlaceType: this.state.placeType&&this.state.placeType.length>0?this.state.placeType.join():''//拍摄场地
        }
      }
      //针对后端要求，序列化数组
      this.state.photos.map(function(photo,i){
        data['photos['+i+'].Url'] = photo.Url;
        data['photos['+i+'].Description'] = photo.Description;
      });
      console.log(data)
      AlbumsActions.add(data);

      this.setState({submit:true});
    }
  },
  showMessage : function(message){
    this.refs.toolTip.toShow(message);
  },
  render: function() {
    var style = {
      outer: {
        backgroundColor: '#fff',
        padding: '40px 60px 70px 60px',
        color: '#777777',
      },
      submitButton: {
        width: '20%',
        height: '50px',
        marginRight: '70px',
        border: '1px solid #e6c288',
        backgroundColor: '#e6c288',
        color: '#000',
        fontSize: '20px',
      },
      preview: {
        width: '20%',
        height: '50px',
        border: '1px solid #e6c288',
        color: '#337ab7',
        fontSize: '20px',
      },
      bottomWrap: {
        textAlign: 'center',
      },
      normalStyle: {
        width: '78px',
        lineHeight: '40px',
        border: '1px solid #e6c288',
        display: 'inline-block',
        textAlign: 'center',
        cursor: 'pointer',
      },
      noSelected: {
        background : 'gray',
        width: '78px',
        lineHeight: '40px',
        border: '1px solid #e6c288',
        color: '#fff',
        display: 'inline-block',
        textAlign: 'center',
        cursor: 'pointer',
      },
      yesSelected: {
        width: '78px',
        lineHeight: '40px',
        background : '#e6c288',
        border: '1px solid #e6c288',
        color: '#fff',
        display: 'inline-block',
        textAlign: 'center',
        cursor: 'pointer',
      },
    };
    //<Button style={style.preview}>预览</Button>
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
    var physicalDetail = this.state.physicalSupport ?
          (<TextInput ref="physicalDetail"
              labelName="实体产品提供详情："
              textClassName="col-xs-4"
              value={this.state.physicalDetail}
          updateValue={this.updatePhysicalDetail}
          placeholder=""/>):'';
    return (
      <div style={style.outer}>
        <InfoHeader infoTitle="作品上传"infoIconClass="glyphicon glyphicon-picture" titleImage="" />
        <form className='form-horizontal'>
          <TextInput ref="workName"
            labelName="作品名称："
            value = {this.state.title}
            updateValue = {this.updateTitle}
            minLength={1}
            placeholder="名称应该在1-20字之间"/>
          <div className="form-group">
            <div className="col-xs-3 text-right">
              <label className="control-label">上传封面：</label>
            </div>
            <div className="col-xs-8">
              <ImageOptimus
                onUploadSucceed={coverUrl => console.log('coverUrl', coverUrl)}
              />
            </div>
          </div>

          <ChooseImage value={this.state.photos}
            ref="chooseImage" onError={this.showMessage}/>
          <ChooseTags value={this.state.tags} onChange = {this.updateTags}/>
          <TextInput ref="workDescription"
                     type="textarea"
                     value = {this.state.description}
                     updateValue = {this.updateDescription}
                     labelName="作品简述："
                     minLength={15}
                     maxLength={1000}
                     placeholder=""
                     help="作品描述应该在15-1000字之间"
                     style={{minHeight:100}}/>
          <TextInput ref="duration"
                     labelName="拍摄时长："
                     textClassName="col-xs-4"
                     value={this.state.duration}
                     updateValue={this.updateDuration}
                     placeholder="例如：3小时或3天"/>
          <TextInput ref="plateCount"
                     labelName="底片张数："
                     textClassName="col-xs-4"
                     value={this.state.plateCount}
                     updateValue={this.updatePlateCount}
                     placeholder=""/>
          <TextInput ref="truingCount"
                     labelName="精修张数："
                     textClassName="col-xs-4"
                     value={this.state.truingCount}
                     updateValue={this.updateTruingCount}
                     placeholder=""/>
          <TextInput ref="costumeCount"
                     labelName="服装数目："
                     textClassName="col-xs-4"
                     value={this.state.costumeCount}
                     updateValue={this.updateCostumeCount}
                     placeholder=""/>
          <Switch ref="makeUpSupport"
                  label='化妆造型'
                  textOn='提供'
                  textOff='不提供'
                  checked={this.state.makeUpSupport}
                  onChange={this.updateMakeUpSupport}/>
          <Switch ref="originalSupport"
                  label='原片'
                  textOn='全送'
                  textOff='不送'
                  checked={this.state.originalSupport}
                  onChange={this.updateOriginalSupport}/>
          <Switch ref="physicalSupport"
                  label='实体产品'
                  textOn='提供'
                  textOff='不提供'
                  checked={this.state.physicalSupport}
                  onChange={this.updatePhysicalSupport}/>
          {physicalDetail}
          <TextInput ref="unitCount"
                     labelName="拍摄几组："
                     textClassName="col-xs-4"
                     value={this.state.unitCount}
                     updateValue={this.updateUnitCount}
                     placeholder=""/>
          <TextInput ref="sceneCount"
                     labelName="拍摄场景数量："
                     textClassName="col-xs-4"
                     value={this.state.sceneCount}
                     updateValue={this.updateSceneCount}
                     placeholder=""/>
          <TextInput ref="peopleCount"
                     labelName="被拍摄人数："
                     textClassName="col-xs-4"
                     value={this.state.peopleCount}
                     updateValue={this.updatePeopleCount}
                     placeholder=""/>
          <TextInput ref="seatCount"
                     labelName="拍摄机位："
                     textClassName="col-xs-4"
                     value={this.state.seatCount}
                     updateValue={this.updateSeatCount}
                     placeholder=""/>
          <Checkbox labelName="拍摄场地：" value={this.state.placeType} data={placeTypeData} onChange = {this.updatePlaceType}/>
          <TextInput ref="service"
                     type="textarea"
                     value={this.state.service}
                     updateValue={this.updateService}
                     labelName="补充说明："
                     maxLength={1000}
                     help="补充说明不超过1000字" style={{minHeight:100}}/>
          <TextInput ref="price"
                     labelName="套系价格："
                     textClassName="col-xs-4"
                     value={this.state.price}
                     updateValue={this.updatePrice}
                     placeholder="¥面议"
                     help="单位:元"/>
          <div className="row" style={style.bottomWrap}>
            <Button style={style.submitButton} onClick={this.handleSubmit} disabled={this.state.submit}>提交</Button>
            <ToolTip ref="toolTip" title=""/>
          </div>
        </form>
      </div>
    );
  }
});

module.exports = UploadWorks;
