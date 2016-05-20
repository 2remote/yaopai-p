var React = require('react');
var Router = require('react-router');
var Link  = Router.Link;
var History = Router.History;
var Reflux = require('reflux');
var UserStore = require('../../stores/UserStore');

var validator = require('validator');
var InfoHeader = require('../infoHeader');

var Panel = require('react-bootstrap').Panel;
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;

var TextInput = require('../account/textInput');
var ImageInput = require('../account/imageInput');
var AreaSelect = require('../account/areaSelect');
var ToolTip = require('../toolTip');
var MultiImageSelect = require('./multiImageSelect');
var Switch = require('../tools/switch');
var CompanyLogo = require('./companyLogo');
var UserActions = require('../../actions/UserActions');
var PAuthActions = require('../../actions/PAuthActions');
var PAuthStore = require('../../stores/PAuthStore');
var AccountActions = require("../../actions/AccountActions");
var AccountStore = require("../../stores/AccountStore");

/*
  身份证图片上传
*/
var PersonIDImage = React.createClass({
  getInitialState: function(){
    return {
      facecodeDefaultImage : 'img/facecode.png',
      oppositeDefaultImage : 'img/opposite.png',
    }
  },
  getValue : function(){
    var v1 = this.refs.IDPicture1.getValue();
    var v2 = this.refs.IDPicture2.getValue();
    if(v1 && v2 && v1!=this.state.facecodeDefaultImage && v2!=this.state.oppositeDefaultImage){
      return v1+','+v2;
    }else{
      return null;
    }
  },
  upload1 : function(url){
    this.props.upload1(url);
  },
  upload2 : function(url){
    this.props.upload2(url);
  },
  render : function(){
    var style = {
      imgId: {
        marginBottom: '14px',
      },
      info: {
        marginLeft: '70px',
        height: '150px',
        paddingTop: '36px',
      },
      label: {
        lineHeight: '150px',
      },
    };
    var IDImages = [];
    IDImages[0] = this.state.facecodeDefaultImage;
    IDImages[1] = this.state.oppositeDefaultImage;
    if(this.props.value){
      var tmp = this.props.value.split(',');
      if(tmp[0])
        IDImages[0] = tmp[0];
      if(tmp[1])
        IDImages[1] = tmp[1];
    }
    return (
      <div className="form-group">
        <label className="control-label col-xs-3" style={style.label}>身份证正反面：</label>
        <div className="col-xs-9">
          <div className="row" style={style.imgId}>
            <ImageInput width="200"
              height="150"
              addStyle={{width:220}}
              defaultImage={IDImages[0]}
              onUpload={this.upload1}
              onError={this.props.showMessage}
              disabled={this.props.disabled}
              multi_selection={false}
              uid="IDPicture1"
              ref="IDPicture1"
              type="user"/>
            <ImageInput width="200"
              height="150"
              addStyle={{width:220}}
              defaultImage={IDImages[1]}
              onUpload={this.upload2}
              onError={this.props.showMessage}
              disabled={this.props.disabled}
              multi_selection={false}
              uid="IDPicture2"
              ref="IDPicture2"
              type="user"/>
          </div>

          <div className="row">
            <div className="col-xs-4">
              <img height="150" width="200" src="img/id_shili.png" />
            </div>
            <div className="col-xs-8">
              <div style={style.info}>
                1 正反面带头像的清晰照片<br />
                2 仅用于认证请放心上传
              </div>
            </div>
          </div>
        </div>
      </div>
      );
  }
});

var PhotographerAuth = React.createClass({
  mixins: [Reflux.listenTo(PAuthStore, 'handleStoreChange'),Reflux.listenTo(UserStore,'handleUserStoreChange'),Reflux.listenTo(AccountStore,'onAccountChanged'),History],
  getInitialState: function(){
    return {
      authState : '0',
      disabled : false,
      pAuthData : {}
    }
  },
  handleUserStoreChange : function(userData){
    if(userData.isLogin){
      if(userData.userType == 1){
        //已经是摄影师用户,跳转摄影师信息
        this.history.pushState(null,'/account/photographer');
      }else{
        //普通用户，拿到认证数据再判断认证状态
        this.getAuditData();
      }
    }else{
      //没有登录转到登录界面
      UserActions.logout(true);
      this.history.pushState(null,'/');
    }
  },
  handleStoreChange : function(data){
    if(data.flag == 'submitAudit'){
      if(data.hintMessage){
        this.showMessage(data.hintMessage);
      }else{
        this.showMessage('认证资料提交成功！YAOPAI会尽快为您审核！');
        this.getAuditData();
      }
    }
    if(data.flag == 'viewAudit'){
      if(data.hintMessage){
        //没有提交过认证申请
        var pAuthData = data.pAuth;
        //this.showMessage(data.hintMessage);
      }else{
        /*
          提交过认证申请，根据state字段判断审核状态
          state : 0  未处理  1 审核通过  2 审核不通过
          未处理和审核通过时，该页面不能编辑，审核不通过可以重新提交申请
        */
        var pAuthData = data.pAuth;
        _.assignIn(pAuthData,this.state.pAuthData);
        if(pAuthData.State == null){
          this.setState({
            pAuthData: {},
            authState : null,
            disabled : false
          });
        }
        if(pAuthData.State == '0'){
          this.setState({
            pAuthData: pAuthData,
            authState : pAuthData.State,
            disabled : true
          });
        }else if(pAuthData.State == '1'){
          this.setState({
            pAuthData: pAuthData,
            authState : pAuthData.State,
            disabled : true})
        }else if(pAuthData.State == '2'){
          this.setState({
            pAuthData: pAuthData,
            authState : pAuthData.State,
            disabled : false})
        }
      }
    }
  },
  onAccountChanged : function(data){
    if(data.flag == 'userDetail'){
      if(data.detail){
        var pAuthData = this.state.pAuthData;
        _.assignIn(pAuthData,{
          RealName:data.detail.Account.RealName,
          IdNumber:data.detail.Account.IdNumber,
          IdNumberImages:data.detail.Account.IdNumberImages,
        });
        this.setState({
          pAuthData:pAuthData
        });
      }
    }
    if(data.flag == 'changeRealName'){
      PAuthActions.submitAudit({
        Works : this.state.pAuthData.Works
      });
    }
  },
  componentWillMount : function(){
    UserActions.currentUser();
  },
  getAuditData : function(){
    var fields = 'Id,State,CreationTime,Works,Reason,AuditManagerId,AuditTime';
    PAuthActions.viewAudit({Fields:fields});
    AccountActions.userDetail({Fields:'Id,Account.RealName,Account.IdNumber,Account.IdNumberImages,Account.IsCertification'});
  },
  updateProducts : function(result){
    var datas = [];
    if(this.state.pAuthData.Works)
      datas = this.state.pAuthData.Works.split(',');
    datas.push(result);
    var pAuthData = this.state.pAuthData;
    pAuthData.Works = datas.toString();
    this.setState({pAuthData:pAuthData});
  },
  //updateCompanyImages : function(result){
  //  var datas = [];
  //  if(this.state.pAuthData.StudioImages)
  //    datas = this.state.pAuthData.StudioImages.split(',');
  //  datas.push(result);
  //  var pAuthData = this.state.pAuthData;
  //  pAuthData.StudioImages = datas.toString();
  //  this.setState({pAuthData : pAuthData});
  //},
  updateRealName : function(result){
    var data = this.state.pAuthData;
    data.RealName = result;
    this.setState({pAuthData : data})
  },
  //onProvinceChange : function(result){
  //  var data = this.state.pAuthData;
  //  data.ProvinceId = result;
  //  this.setState({pAuthData : data});
  //},
  //onCityChange : function(result){
  //  var data = this.state.pAuthData;
  //  data.CityId = result;
  //  this.setState({pAuthData:data});
  //},
  //onDistrictChange : function(result){
  //  var data = this.state.pAuthData;
  //  data.CountyId = result;
  //  this.setState({pAuthData : data});
  //},
  //updateWorkPhone : function(result){
  //  var data = this.state.pAuthData;
  //  data.BusinessPhone = result;
  //  this.setState({pAuthData : data});
  //},
  //updateWechat : function(result){
  //  var data = this.state.pAuthData;
  //  data.Weixin = result;
  //  this.setState({pAuthData : data});
  //},
  //updateQQ : function(result){
  //  var data = this.state.pAuthData;
  //  data.Oicq = result;
  //  this.setState({pAuthData : data});
  //},
  updatePersonID : function(result){
    var data = this.state.pAuthData;
    data.IdNumber = result;
    this.setState({pAuthData : data});
  },
  updateIDImage1 : function(result){
    var IDImages = [];
    if(this.state.pAuthData.IdNumberImages){
      IDImages = this.state.pAuthData.IdNumberImages.split(',');
      IDImages[0] = result;
    }else{
      IDImages[0] = result;
      IDImages[1] = '';
    }
    var data = this.state.pAuthData;
    data.IdNumberImages = IDImages.toString();
    this.setState({pAuthData : data});
  },
  updateIDImage2 : function(result){
    var IDImages = [];
    if(this.state.pAuthData.IdNumberImages){
      IDImages = this.state.pAuthData.IdNumberImages.split(',');
      IDImages[1] = result;
    }else{
      IDImages[0] = '';
      IDImages[1] = result;
    }
    var data = this.state.pAuthData;
    data.IdNumberImages = IDImages.toString();
    this.setState({pAuthData : data});
  },
  //updateSign : function(result){
  //  var data = this.state.pAuthData;
  //  data.Signature = result;
  //  this.setState({pAuthData : data});
  //},
  //updateWorkLinks : function(result){
  //  var data = this.state.pAuthData;
  //  data.WorkLinks = result;
  //  this.setState({pAuthData : data});
  //},
  updateHasCompany : function(result){
    var data = this.state.pAuthData;
    data.OwnedStudio = result;
    this.setState({pAuthData : data});
  },
  updateCompanyName : function(result){
    var data = this.state.pAuthData;
    data.StudioName = result;
    this.setState({pAuthData : data});
  },
  //updateCompanyLogo : function(result){
  //  var data = this.state.pAuthData;
  //  data.StudioLogo = result;
  //  this.setState({pAuthData : data});
  //},
  updateCompanyAddress : function(result){
    var data = this.state.pAuthData;
    data.StudioAddress = result;
    this.setState({pAuthData : data});
  },
  //updateCompanyIntro : function(result){
  //  var data = this.state.pAuthData;
  //  data.StudioIntroduction = result;
  //  this.setState({pAuthData: data});
  //},
  removeWorks : function(index){
    var data = this.state.pAuthData;
    var works = data.Works;
    if(works && works.length > 0){
      works = works.split(',');
      if(index < works.length){
        works.splice(index,1);
        data.Works = works.toString();
        this.setState({pAuthData : data});
      }
    }
  },
  //removeCompanyImage : function(index){
  //  var data = this.state.pAuthData;
  //  var companyImages = data.StudioImages;
  //  if(companyImages && companyImages.length > 0){
  //    companyImages = companyImages.split(',');
  //    if(index < companyImages.length){
  //      companyImages.splice(index,1);
  //      data.StudioImages = companyImages.toString();
  //      this.setState({pAuthData : data});
  //    }
  //  }
  //},
  /*
    验证所有输入是否合法
  */
  validate : function(){
    var message = '';
    if(!this.refs.realName.isValidated()){
      message = '真实姓名最少2个字';
      return message;
    }
    //if(!this.refs.area.getValue()){
    //  message = '请选择常驻地';
    //  return message;
    //}
    //if(!this.refs.workPhone.isValidated()){
    //  message = '请填写正确的电话号码';
    //  return message;
    //}
    //if(!this.refs.wechat.isValidated()){
    //  message = '请填写正确微信号码';
    //  return message;
    //}
    //if(!this.refs.qq.isValidated()){
    //  message = '请填写正确的qq号码';
    //  return message;
    //}
    if(!this.refs.IDNumber.isValidated()){
      message = '请填写正确的身份证号码';
      return message;
    }
    //必须上传两个图片
    if(!this.refs.personIDImage.getValue()){
      message = '请上传身份证照片';
      return message;
    }
    //if(!this.refs.personIntro.isValidated()){
    //  message = '个人简介必须在10字以上';
    //  return message;
    //}
    if(!this.state.pAuthData.Works || this.state.pAuthData.Works.split(',').length < 8 ){
      message = '请上传8-15张个人作品';
      return message;
    }
    if(this.refs.hasCompany.getValue()){
      //如果有工作室，需要填全所有工作室的信息
      if(!this.refs.companyName.isValidated()){
        message = '请填写您的工作室名称';
        return message;
      }
      //if(!this.refs.complanyLogo.getValue()){
      //  message = '请上传您的工作室logo';
      //  return message;
      //}
      if(!this.refs.address.isValidated()){
        message = '请填写工作室的详细地址';
        return message;
      }
      //if(!this.refs.companyIntro.isValidated()){
      //  message = '请填写工作室的简介';
      //  return message;
      //}
      //if(!this.state.pAuthData.StudioImages){
      //  message = "请上传工作室的照片";
      //  return message;
      //}
    }
    return message;
  },
  showMessage : function(message) {
    this.refs.toolTip.toShow(message);
  },
  handleSubmit : function(){
    var message = this.validate();
    if(!message){
      //var data = {
      //  RealName : this.state.pAuthData.RealName,
      //  BusinessLocation : this.state.pAuthData.CountyId?this.state.pAuthData.CountyId:this.state.pAuthData.CityId?this.state.pAuthData.CityId:this.state.pAuthData.ProvinceId,
      //  BusinessPhone : this.state.pAuthData.BusinessPhone,
      //  Weixin : this.state.pAuthData.Weixin,
      //  Oicq : this.state.pAuthData.Oicq,
      //  IdNumber : this.state.pAuthData.IdNumber,
      //  IdNumberImages : this.state.pAuthData.IdNumberImages,
      //  Signature : this.state.pAuthData.Signature,
      //  WorkLinks : this.state.pAuthData.WorkLinks,
      //  Works : this.state.pAuthData.Works,
      //  OwnedStudio : this.state.pAuthData.OwnedStudio,
      //  StudioName : this.state.pAuthData.StudioName,
      //  StudioLogo : this.state.pAuthData.StudioLogo,
      //  StudioAddress : this.state.pAuthData.StudioAddress,
      //  StudioIntroduction : this.state.pAuthData.StudioIntroduction,
      //  StudioImages : this.state.pAuthData.StudioImages
      //};
      PAuthActions.change({
        OwnedStudio:this.state.pAuthData.OwnedStudio,
        StudioName:this.state.pAuthData.OwnedStudio?this.state.pAuthData.StudioName:'',
        StudioAddress:this.state.pAuthData.OwnedStudio?this.state.pAuthData.StudioAddress:'',
      });
      AccountActions.changeRealName({
        RealName:this.state.pAuthData.RealName,
        IdNumber:this.state.pAuthData.IdNumber,
        IdNumberImages:this.state.pAuthData.IdNumberImages,
      })
    }else{
      this.showMessage(message);
    }
  },
  render: function() {
    var style = {
      outer: {
        backgroundColor: '#fff',
        padding: '40px 60px 70px 60px',
        color: '#777777',
      },
    };
    var rightInfo = '未认证';
    if(typeof this.state.pAuthData.State == 'undefined'){
      rightInfo = '未认证';
    }else if(this.state.authState == '0'){
      rightInfo = '审核中';
    }
    if(this.state.authState == '1'){
      rightInfo = '审核通过';
    }
    if(this.state.authState == '2'){
      rightInfo = '审核不通过';
    }
    var studio = '';
    if (this.state.pAuthData.OwnedStudio) {
      studio = (
        <div>
          <TextInput ref="companyName"
            labelName="工作室名称："
            value = {this.state.pAuthData.StudioName}
            updateValue = {this.updateCompanyName}
            minLength={2}
            disabled={this.state.disabled}
            textClassName="col-xs-5"
            placeholder="" />
          <TextInput ref="address"
            labelName="工作室地址："
            value = {this.state.pAuthData.StudioAddress}
            updateValue = {this.updateCompanyAddress}
            minLength={5}
            disabled={this.state.disabled}
            textClassName="col-xs-5"
            placeholder=""/>
        </div>
      );
    }
    return (
      <div style={style.outer}>
        <InfoHeader infoTitle="摄影师认证" rightInfo={rightInfo} infoIconClass="glyphicon glyphicon-camera"/>
        <form className='form-horizontal'>
          <TextInput ref="realName"
            labelName="姓名："
            value = {this.state.pAuthData.RealName}
            updateValue = {this.updateRealName}
            minLength={2}
            disabled={this.state.disabled}
            textClassName="col-xs-5"
            placeholder="请输入您的真实姓名"/>
          <TextInput ref="IDNumber"
            labelName="身份证号码："
            value = {this.state.pAuthData.IdNumber}
            updateValue = {this.updatePersonID}
            minLength={15}
            disabled={this.state.disabled}
            textClassName="col-xs-5"
            placeholder=""/>
          <PersonIDImage ref="personIDImage"
            value = {this.state.pAuthData.IdNumberImages}
            upload1={this.updateIDImage1}
            upload2={this.updateIDImage2}
            showMessage={this.showMessage}
            disabled={this.state.disabled}/>
          <MultiImageSelect ref="works"
            uid = "worksSelect"
            labelName="个人作品："
            width="100"
            height="100"
            images={this.state.pAuthData.Works}
            disabled={this.state.disabled}
            maxCount={15}
            placeholder="温馨提示：请上传8-15张多种风格的作品"
            updateImages={this.updateProducts}
            showMessage={this.showMessage}
            remove={this.removeWorks}/>
          <Switch ref="hasCompany"
            label='是否有工作室'
            textOn='是'
            textOff='否'
            disabled={this.state.disabled}
            checked={this.state.pAuthData.OwnedStudio}
            onChange={this.updateHasCompany}/>
          {studio}
          <Button className="col-xs-offset-3"
            disabled={this.state.disabled}
            bsStyle="primary"
            onClick={this.handleSubmit}>
            提交
          </Button>
          <ToolTip ref="toolTip" title=""/>
        </form>
      </div>
    );
  }
});

module.exports = PhotographerAuth;
