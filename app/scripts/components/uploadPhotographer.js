var _ = require('lodash');
var React = require('react');
var Reflux = require('reflux');
var validator = require('validator');
var Button = require('react-bootstrap').Button;

var assert = require('assert');

var InfoHeader= require('./infoHeader');
var TextInput = require('./account/textInput');
var ChooseImage = require('./account/chooseImage');
var ToolTip = require('./toolTip');

var AlbumsStore = require('../stores/AlbumsStore');
import $ from 'jquery'
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
  3. 在这个界面可以增加，修改相册。
*/
var UploadPhotographer = React.createClass({
  mixins : [Reflux.listenTo(AlbumsStore,'onStoreChanged'),Reflux.listenTo(WorkStore,'onWorkStoreChange'),Reflux.listenTo(UserStore, 'isLogin'), History],
  getInitialState : function(){
    return {
      title : '',
      category : '',
      description : '',
      service : '',
      price : '' ,
      plateCount : '' ,
      truingCount : '' ,
      costumeCount : '' ,
      duration : '' ,
      unitCount : '' ,
      sceneCount : '' ,
      peopleCount : '' ,
      seatCount : '' ,
      cover : -1,
      cut : '',
      photos : [],
      tags : [],
      submit: false,
      allTags : [],
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
          price : '' ,
          duration : '' ,
          plateCount : '' ,
          truingCount : '' ,
          costumeCount : '' ,
          unitCount : '' ,
          sceneCount : '' ,
          peopleCount : '' ,
          seatCount : '' ,
          cover : -1,
          cut : '',
          photos : [],
          tags : [],
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
    if(data.flag == 'getTagList'){
      //获取所有的标签列表值
      this.setState({"allTags" : data.tags});
    }
  },
  onWorkStoreChange : function(data){
    if(data.flag == 'onSetCut'){
      this.setState({cut : data.cut});
    }else{
      //处理封面
      // var cover = -1;
      // for(var i =0 ; i < data.length ; i ++){
      //   if(data[i].isCover) cover = i;
      // }
      this.setState({photos : data});
    }
  },
  updateTitle : function(title){
    this.setState({title: title});
  },
  updatePhotos : function(photos){
    this.setState({photos : photos});
  },
  updateTags : function(tags){
    this.setState({tags : tags});
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

    if($.trim(this.state.title).length < 1 || $.trim(this.state.title).length > 20){
      React.findDOMNode(this.refs.workName.refs.input.refs.input).focus();
      this.showMessage('作品名称必须在1-20字之间');
      return false;
    }
    if(this.state.cover === -1 ){
      this.showMessage('请上传封面');
      return false;
    }
    if(this.state.photos.length < 6){
      this.showMessage('请至少上传 6 张作品');
      return false;
    }

    var tag1=[],tag2=[],tag3 =[];
    var n1=0,n2=0,n3=0;

      //获得全部标签并放入state
      AlbumsActions.getTagList();
      //比对state中的全部标签和已选标签
      var selectedArr = this.state.tags;
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

    if($.trim(this.state.description).length < 15 || $.trim(this.state.description).length > 1000){
      this.showMessage('作品描述必须在15-1000字之间');
      React.findDOMNode(this.refs.workDescription.refs.input.refs.input).focus();
      return false;
    }
    if(this.state.duration.length <= 0){
      this.showMessage('拍摄时长不能为空');
      React.findDOMNode(this.refs.duration.refs.input.refs.input).focus();
      return false;
    }
    if(!validator.isInt($.trim(this.state.plateCount)) || parseInt(this.state.plateCount) <= 0){
      this.showMessage('底片张数必须大于0');
      React.findDOMNode(this.refs.plateCount.refs.input.refs.input).focus();
      return false;
    }
    if(!validator.isInt($.trim(this.state.truingCount)) || parseInt(this.state.truingCount) < 0){
      this.showMessage('精修张数仅限数字,且不能为空');
      React.findDOMNode(this.refs.truingCount.refs.input.refs.input).focus();
      return false;
    }
    if(!validator.isInt($.trim(this.state.costumeCount)) || parseInt(this.state.costumeCount) < 0){
      this.showMessage('服装数目仅限数字,且不能为空');
      React.findDOMNode(this.refs.costumeCount.refs.input.refs.input).focus();
      return false;
    }
    if(!validator.isInt($.trim(this.state.unitCount)) || parseInt(this.state.unitCount) <= 0){
      this.showMessage('拍摄组数仅限大于0的数字,且不能为空');
      React.findDOMNode(this.refs.unitCount.refs.input.refs.input).focus();
      return false;
    }
    if(!validator.isInt($.trim(this.state.sceneCount)) || parseInt(this.state.sceneCount) <= 0){
      this.showMessage('拍摄场景数量仅限大于0的数字,且不能为空');
      React.findDOMNode(this.refs.sceneCount.refs.input.refs.input).focus();
      return false;
    }
    if(!validator.isInt($.trim(this.state.peopleCount)) || parseInt(this.state.peopleCount) < 0){
      this.showMessage('被拍摄人数仅限数字,且不能为空');
      React.findDOMNode(this.refs.peopleCount.refs.input.refs.input).focus();
      return false;
    }
    if(!validator.isInt($.trim(this.state.seatCount)) || parseInt(this.state.seatCount) <= 0){
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
    if (this.state.placeType.length==0) {6
      this.showMessage('请选择拍摄场地');
      return false;
    }
    if(this.state.service && $.trim(this.state.service).length > 1000){
      this.showMessage('补充服务说明不超过1000字');
      React.findDOMNode(this.refs.service.refs.input.refs.input).focus();
      return false;
    }
    if(!validator.isFloat($.trim(this.state.price)) || parseFloat(this.state.price) < 1){
      this.showMessage('价格仅限大于等于1的数字,且不能为空');
      React.findDOMNode(this.refs.price.refs.input.refs.input).focus();
      return false;
    }
    return true;
  },
  handleSubmit : function(e){
    e.preventDefault && e.preventDefault()
    if(this.validate()){
      var data = {
        Title : $.trim(this.state.title),
        Description : $.trim(this.state.description),
        Service : $.trim(this.state.service),
        Price : $.trim(this.state.price),
        Negotiable : this.state.price==0?true:false,
        Cover : this.state.cover,
        Cut: this.state.cut?this.state.cut:'',
        Tags: this.state.tags.join(','),
        Detail: {
          Duration: $.trim(this.state.duration),//拍摄时长
          PlateCount: $.trim(this.state.plateCount),//底片张数
          TruingCount: $.trim(this.state.truingCount),//精修张数
          CostumeCount: $.trim(this.state.costumeCount),//服装数目
          MakeUpSupport: $.trim(this.state.makeUpSupport),//化妆造型
          OriginalSupport: $.trim(this.state.originalSupport),//送原片
          PhysicalSupport: $.trim(this.state.physicalSupport),//提供实体产品
          PhysicalDetail: $.trim(this.state.physicalDetail),//实体产品提供详情
          UnitCount: $.trim(this.state.unitCount),//拍摄几组
          SceneCount: $.trim(this.state.sceneCount),//拍摄场景数量
          PeopleCount: $.trim(this.state.peopleCount),//被拍摄人数
          SeatCount: $.trim(this.state.seatCount),//拍摄机位
          PlaceType: this.state.placeType&&this.state.placeType.length>0?this.state.placeType.join():''//拍摄场地
        }
      }
      //针对后端要求，序列化数组
      this.state.photos.map(function(photo,i){
        data['photos['+i+'].Url'] = photo.Url;
        data['photos['+i+'].Description'] = photo.Description;
      });

      AlbumsActions.add(data);
      alert("恭喜你,上传作品成功!")
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
        <InfoHeader infoTitle="作品上传" infoIconClass="glyphicon glyphicon-picture" titleImage="" />
        <div style={{fontSize:'12px',lineHeight:'30px',background:'#f5f5f5',border:'1px dashed #e4e4e4',color:'#000',padding:'15px 20px',margin: '-15px 0 30px 0'}}>
          <b>作品上传注意事项</b><br />
          1、作品名称、简述、补充说明以及每一张图片上均不能出现摄影师的微博、微信、QQ、电话等联系方式<br />
          2、每套作品至少上传 6 张图片，单张图片不能超过 10M；建议不要将多图排版编辑到一张图片中<br />
          3、除「补充服务说明 」为非必填项外，其他都为必填项， 请认真填写服务详情，方便客户的选择和预约
        </div>
        <form className='form-horizontal'>
          <TextInput ref="workName"
            labelName="作品名称："
            value = {this.state.title}
            updateValue = {this.updateTitle}
            minLength={1}
            placeholder="名称应该在1-20字之间"/>
          <div className="form-group" ref="cover">
            <div className="col-xs-3 text-right">
              <label className="control-label">上传封面：<br />（宽度不得超过2000）</label>
            </div>
            <div className="col-xs-8">
              <ImageOptimus
                onUploadSucceed={ this.updateCover }
              />

            </div>
          </div>

          <ChooseImage value={this.state.photos}
            ref="chooseImage" onError={this.showMessage}/>
          <ChooseTags ref="chooseTags" value={this.state.tags} onChange = {this.updateTags}/>
          <TextInput ref="workDescription"
                     type="textarea"
                     value = {this.state.description}
                     updateValue = {this.updateDescription}
                     labelName="作品描述："
                     minLength={15}
                     maxLength={1000}
                     placeholder="作品描述字数限制15-1000字之间"
                     style={{minHeight:100}}/>
          <TextInput ref="duration"
                     labelName="拍摄时长："
                     textClassName="col-xs-4"
                     value={this.state.duration}
                     updateValue={this.updateDuration}
                     placeholder="如：3小时 或 3天 (请标注时间单位)"/>
          <TextInput ref="plateCount"
                     labelName="底片张数："
                     textClassName="col-xs-4"
                     value={this.state.plateCount}
                     updateValue={this.updatePlateCount}
                     placeholder="请填写数字，如 100"/>
          <TextInput ref="truingCount"
                     labelName="精修张数："
                     textClassName="col-xs-4"
                     value={this.state.truingCount}
                     updateValue={this.updateTruingCount}
                     placeholder="请填写数字，如 20"/>
          <TextInput ref="costumeCount"
                     labelName="服装数目："
                     textClassName="col-xs-4"
                     value={this.state.costumeCount}
                     updateValue={this.updateCostumeCount}
                     placeholder="请填写数字，如 2；如不提供服装请填写 0"/>
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
                     labelName="拍摄组数："
                     textClassName="col-xs-4"
                     value={this.state.unitCount}
                     updateValue={this.updateUnitCount}
                     placeholder="请填写数字，如 3"/>
          <TextInput ref="sceneCount"
                     labelName="拍摄场景数量："
                     textClassName="col-xs-4"
                     value={this.state.sceneCount}
                     updateValue={this.updateSceneCount}
                     placeholder="请填写数字，如 3"/>
          <TextInput ref="peopleCount"
                     labelName="被拍摄人数："
                     textClassName="col-xs-4"
                     value={this.state.peopleCount}
                     updateValue={this.updatePeopleCount}
                     placeholder="请填写数字,如 1"/>
          <TextInput ref="seatCount"
                     labelName="拍摄机位："
                     textClassName="col-xs-4"
                     value={this.state.seatCount}
                     updateValue={this.updateSeatCount}
                     placeholder="请填写数字,如 1"/>
          <Checkbox labelName="拍摄场地：" ref="placeType" value={this.state.placeType} data={placeTypeData} onChange = {this.updatePlaceType}/>
          <TextInput ref="service"
                     type="textarea"
                     value={this.state.service}
                     updateValue={this.updateService}
                     labelName="补充服务说明："
                     maxLength={1000}
                     placeholder="(非必填) 补充服务说明不超过1000字"
                     style={{minHeight:100}}/>
          <TextInput ref="price"
                     labelName="套系价格："
                     textClassName="col-xs-4"
                     value={this.state.price}
                     updateValue={this.updatePrice}
                     placeholder="¥(单位:元)"
                     />
          <div className="row" style={style.bottomWrap}>
            <Button style={style.submitButton} onClick={this.handleSubmit} disabled={this.state.submit}>提交</Button>

          </div>
        </form>
        <ToolTip ref="toolTip" title=""/>
      </div>
    );
  }
});

module.exports = UploadPhotographer;
