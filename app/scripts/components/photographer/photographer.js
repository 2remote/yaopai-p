var React = require('react');
var Router = require('react-router');
var Link  = Router.Link;
var History = Router.History;
var Location = Router.Location;
var Reflux = require('reflux');

var validator = require('validator');
var InfoHeader = require('../infoHeader');

var Panel = require('react-bootstrap').Panel;
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;
var FormControls = require('react-bootstrap').FormControls;

var TextInput = require('../account/textInput');
var ToolTip = require('../toolTip');
var MultiImageSelect = require('./multiImageSelect');
var CompanyLogo = require('./companyLogo');
var UserActions = require('../../actions/UserActions');
var UserStore = require('../../stores/UserStore');
var PAuthActions = require('../../actions/PAuthActions');
var PAuthStore = require('../../stores/PAuthStore');
var Switch = require('../tools/switch');

var Photographer = React.createClass({
  mixins: [Reflux.listenTo(PAuthStore, 'handleStoreChange'),Reflux.listenTo(UserStore,'handleUserStoreChange'),History,Location],
  getInitialState : function () {
    return{
      photographer : {},
      studio : {}
    }
  },
  componentDidMount : function(){
    UserActions.currentUser();
  },
  handleUserStoreChange : function(userData){
    if(userData.isLogin){
      if(userData.userType == 1){
        //摄影师用户,获取摄影师信息
        if(!this.state.photographer.Id){
          PAuthActions.current();
        }
      }else{
        //普通用户转到摄影师认证
        this.history.pushState(null,'/account/pAuth');
      }
    }else{
      //没有登录转到登录界面
      this.history.pushState({nextpage : this.props.location.pathname},'/');
    }
  },
  handleStoreChange : function(data){
    if(data.flag == 'current' ){
      if(data.hintMessage){
        this.showMessage(data.hintMessage);
      }else{
        this.setState({photographer : data.photographer});
        //if(data.photographer.OwnedStudio){
        //  PAuthActions.currentStudio();
        //}
      }
    }
    //if(data.flag == 'currentStudio'){
    //  this.setState({studio : data.studio});
    //}
    if(data.flag == 'change'){
      if(data.hintMessage){
        this.showMessage(data.hintMessage);
      }else{
        this.showMessage("更新信息成功");
        PAuthActions.current();
      }
    }
    //if(data.flag == 'changeStudio'){
    //  if(data.hintMessage){
    //    this.showMessage(data.hintMessage);
    //  }else{
    //    this.showMessage("更新信息成功");
    //    PAuthActions.currentStudio();
    //  }
    //}
  },
  //updateCompanyImages : function(result){
  //  var datas = [];
  //  if(this.state.studio.Images)
  //    datas = this.state.studio.Images.split(',');
  //  datas.push(result);
  //  var studio = this.state.studio;
  //  studio.Images = datas.toString();
  //  this.setState({studio : studio});
  //},
  //removeCompanyImage : function(index){
  //  var data = this.state.studio;
  //  var companyImages = data.Images;
  //  if(companyImages && companyImages.length > 0){
  //    companyImages = companyImages.split(',');
  //    if(index < companyImages.length){
  //      companyImages.splice(index,1);
  //      data.Images = companyImages.toString();
  //      this.setState({studio : data});
  //    }
  //  }
  //},
  //updateRealName : function(result){
  //  var data = this.state.photographer;
  //  data.RealName = result;
  //  this.setState({photographer : data})
  //},
  //onProvinceChange : function(result){
  //  var data = this.state.photographer;
  //  data.ProvinceId = result;
  //  data.CityId = 0 ;
  //  data.CountyId = 0 ;
  //  this.setState({photographer : data});
  //},
  //onCityChange : function(result){
  //  var data = this.state.photographer;
  //  data.CityId = result;
  //  data.CountyId =0;
  //  this.setState({photographer:data});
  //},
  //onDistrictChange : function(result){
  //  var data = this.state.photographer;
  //  data.CountyId = result;
  //  this.setState({photographer : data});
  //},
  //updateWorkPhone : function(result){
  //  var data = this.state.photographer;
  //  data.BusinessPhone = result;
  //  this.setState({photographer : data});
  //},
  //updateWechat : function(result){
  //  var data = this.state.photographer;
  //  data.Weixin = result;
  //  this.setState({photographer : data});
  //},
  //updateQQ : function(result){
  //  var data = this.state.photographer;
  //  data.Oicq = result;
  //  this.setState({photographer : data});
  //},
  //updateSign : function(result){
  //  var data = this.state.photographer;
  //  data.Signature = result;
  //  this.setState({photographer : data});
  //},
  updateCompanyName : function(result){
    var data = this.state.photographer;
    data.StudioName = result;
    this.setState({photographer : data});
  },
  //updateCompanyLogo : function(result){
  //  var data = this.state.studio;
  //  data.Logo = result;
  //  this.setState({studio : data});
  //},
  updateCompanyAddress : function(result){
    var data = this.state.photographer;
    data.StudioAddress = result;
    this.setState({photographer : data});
  },
  //updateCompanyIntro : function(result){
  //  var data = this.state.studio;
  //  data.Introduction = result;
  //  this.setState({studio: data});
  //},
  updateHasCompany : function(result){
    var data = this.state.photographer;
    data.OwnedStudio = result;
    this.setState({photographer : data});
  },
  showMessage : function(message){
    this.refs.toolTip.toShow(message);
  },
  /*
    验证所有输入是否合法
  */
  validate : function(){
    var message = '';
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
    //if(!this.refs.personIntro.isValidated()){
    //  message = '个人签名必须在10-100字之间';
    //  return message;
    //}
    if(this.state.photographer.OwnedStudio){
      //如果有工作室，需要填全所有工作室的信息
      if(!this.refs.companyName.isValidated()){
        message = '请填写您的工作室名称';
        return message;
      }
      if(!this.refs.address.isValidated()){
        message = '请填写工作室的详细地址';
        return message;
      }
    }
    return message;
  },
  handleSubmit : function(){
    var message = this.validate();
    if(!message){
      //var pdata = {
      //  BusinessLocation : this.state.photographer.CountyId?this.state.photographer.CountyId:this.state.photographer.CityId?this.state.photographer.CityId:this.state.photographer.ProvinceId,
      //  BusinessPhone : this.state.photographer.BusinessPhone,
      //  Weixin : this.state.photographer.Weixin,
      //  Oicq : this.state.photographer.Oicq,
      //  Signature : this.state.photographer.Signature,
      //  OwnedStudio : this.state.photographer.OwnedStudio,
      //};
      //var sdata = {
      //  Name : this.state.studio.Name,
      //  Logo : this.state.studio.Logo,
      //  Address : this.state.studio.Address,
      //  Introduction : this.state.studio.Introduction,
      //  Images : this.state.studio.Images
      //};
      PAuthActions.change({
        OwnedStudio:this.state.photographer.OwnedStudio,
        StudioName:this.state.photographer.OwnedStudio?this.state.photographer.StudioName:'',
        StudioAddress:this.state.photographer.OwnedStudio?this.state.photographer.StudioAddress:'',
      });
      //if (this.state.photographer.OwnedStudio) {
      //  PAuthActions.changeStudio(sdata);
      //}
    }else{
      this.showMessage(message);
    }
  },
  render : function(){
    var style = {
      outer: {
        backgroundColor: '#fff',
        padding: '40px 60px 70px 60px',
        color: '#777777',
      },
    };
    var studio = '';
    if (this.state.photographer.OwnedStudio) {
      studio = (
        <div>
          <TextInput ref="companyName"
            labelName="工作室名称："
            value = {this.state.photographer.StudioName}
            updateValue = {this.updateCompanyName}
            minLength={2}
            textClassName="col-xs-4"
            placeholder=""/>
          <TextInput ref="address"
            labelName="工作室地址："
            value = {this.state.photographer.StudioAddress}
            updateValue = {this.updateCompanyAddress}
            minLength={5}
            textClassName="col-xs-4"
            placeholder=""/>
        </div>
      );
    }
    var address = this.state.photographer.ProvinceName + this.state.photographer.CityName + this.state.photographer.CountyName;
    return (
      <div style={style.outer}>
        <InfoHeader infoTitle="摄影师信息" rightInfo="已审核" infoIconClass="glyphicon glyphicon-camera"/>
        <form className='form-horizontal'>
          <FormControls.Static label="姓名："
            labelClassName="col-xs-3"
            wrapperClassName="col-xs-4"
            value={this.state.photographer.NickName} />
          <FormControls.Static label="常驻地："
           labelClassName="col-xs-3"
           wrapperClassName="col-xs-4"
           value={address} />
          <FormControls.Static label="是否签约摄影师："
           labelClassName="col-xs-3"
           wrapperClassName="col-xs-4"
           value={this.state.photographer.Contracted?'是':'否'} />
          <Switch ref="hasCompany"
            label='是否有工作室'
            textOn='是'
            textOff='否'
            checked={this.state.photographer.OwnedStudio}
            onChange={this.updateHasCompany}/>
          {studio}
          <Button className="col-xs-offset-3"
            disabled={this.state.disabled}
            bsStyle="primary"
            onClick={this.handleSubmit}>
            保存
          </Button>
          <ToolTip ref="toolTip" title=""/>
        </form>
      </div>
    );
  }

});

module.exports = Photographer;
