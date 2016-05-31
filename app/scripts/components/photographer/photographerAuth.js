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

var Switch = require('../tools/switch');
var CompanyLogo = require('./companyLogo');
var UserActions = require('../../actions/UserActions');
var PAuthActions = require('../../actions/PAuthActions');
var PAuthStore = require('../../stores/PAuthStore');
var AccountActions = require("../../actions/AccountActions");
var AccountStore = require("../../stores/AccountStore");

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

  //updateCompanyImages : function(result){
  //  var datas = [];
  //  if(this.state.pAuthData.StudioImages)
  //    datas = this.state.pAuthData.StudioImages.split(',');
  //  datas.push(result);
  //  var pAuthData = this.state.pAuthData;
  //  pAuthData.StudioImages = datas.toString();
  //  this.setState({pAuthData : pAuthData});
  //},

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
    console.log('Attention!', this.props);
    const pathname = this.props.location.pathname;
    const stepperInactiveStyle = {
      background: '#afa',
      padding: '10px 15px',
    };
    const stepperActiveStyle = Object.assign({}, stepperInactiveStyle, {
      background: '#f60'
    });
    return (
      <div style={style.outer}>
        <InfoHeader
          infoTitle="摄影师认证"
          rightInfo={rightInfo}
          infoIconClass="glyphicon glyphicon-camera"
        />
        <div className="row">
          <div className="col-xs-4"
            style={ pathname === '/account/pAuth/basic' ? stepperActiveStyle : stepperInactiveStyle }
          >
            第一步：基本信息必需填写= =
          </div>
          <div className="col-xs-4"
            style={ pathname === '/account/pAuth/realname' ? stepperActiveStyle : stepperInactiveStyle }
          >
            第二步：实名认证你懂的^ ^
          </div>
          <div className="col-xs-4"
            style={ pathname === '/account/pAuth/submitaudit' ? stepperActiveStyle : stepperInactiveStyle }
          >
            第三步：上传作品看好你哦！
          </div>
        </div>
        { this.props.children }
        <hr />
        {/*<form className='form-horizontal'>
          <Button className="col-xs-offset-3"
            disabled={this.state.disabled}
            bsStyle="primary"
            onClick={this.handleSubmit}>
            提交
          </Button>
          <ToolTip ref="toolTip" title=""/>
        </form>*/}
      </div>
    );
  }
});

module.exports = PhotographerAuth;
