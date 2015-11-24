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
var HasCompany = require('./hasCompany');
var CompanyLogo = require('./companyLogo');
var UserActions = require('../../actions/UserActions');
var PAuthActions = require('../../actions/PAuthActions');
var PAuthStore = require('../../stores/PAuthStore');

/*
  身份证图片上传
*/
var PersonIDImage = React.createClass({
  getValue : function(){
    if(this.refs.IDPicture1.getValue() && this.refs.IDPicture2.getValue()){
      return this.refs.IDPicture1.getValue()+','+this.refs.IDPicture2.getValue();
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
        height: '150px',
        paddingTop: '36px',
      },
      label: {
        lineHeight: '150px',
      },
    };
    var IDImages = [];
    IDImages[0] = 'img/facecode.png';
    IDImages[1] = 'img/opposite.png';
    if(this.props.value){
      var tmp = this.props.value.split(',');
      if(tmp[0])
        IDImages[0] = tmp[0];
      if(tmp[1])
        IDImages[1] = tmp[1];
    }
    return (
      <div className="form-group">
        <label className="control-label col-xs-2" style={style.label}>身份证正反面：</label>
        <div className="col-xs-10">
          <div className="row" style={style.imgId}>
            <ImageInput width="200" 
              height="150" 
              defaultImage={IDImages[0]} 
              onUpload={this.upload1} 
              disabled={this.props.disabled}
              uid="IDPicture1" 
              ref="IDPicture1" 
              type="user"/>
            <ImageInput width="200" 
              height="150" 
              defaultImage={IDImages[1]} 
              onUpload={this.upload2}
              disabled={this.props.disabled}
              uid="IDPicture2" 
              ref="IDPicture2" 
              type="user"/>
          </div>

          <div className="row">
            <div className="col-xs-4">
              <img height="150" width="200" src="img/id_shili.png" />
            </div>
            <div className="col-xs-4">
              <div style={style.info}>
                1 正反面带头像的清晰照片<br />
                2 照片大小不超过3M <br />
                3 仅用于认证请放心上传
              </div>
            </div>
          </div>
        </div>
      </div>
      );
  }
});

var PhotographerAuth = React.createClass({
  mixins: [Reflux.listenTo(PAuthStore, 'handleStoreChange'),Reflux.listenTo(UserStore,'handleUserStoreChange'),History],
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
        this.showMessage('提交认证成功！');
        this.getAuditData();
      }
    }
    if(data.flag == 'viewAudit'){
      if(data.hintMessage){
        //没有提交过认证申请
        this.showMessage(data.hintMessage);
      }else{
        /*
          提交过认证申请，根据state字段判断审核状态
          state : 0  未处理  1 审核通过  2 审核不通过
          未处理和审核通过时，该页面不能编辑，审核不通过可以重新提交申请
        */
        var pAuthData = data.pAuth;
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
  componentWillMount : function(){
    UserActions.currentUser();
  },
  getAuditData : function(){
    var fields = 'Id,State,,BusinessPhone,CreationTime,IdNumber,IdNumberImages,Oicq,OwnedStudio,';
    fields = fields +'RealName,Signature,StudioAddress,StudioImages,StudioIntroduction,StudioLogo,';
    fields = fields +'StudioName,Weixin,WorkLinks,Works,ProvinceId,ProvinceName,CityId,CityName,CountyId,CountyName';
    PAuthActions.viewAudit({Fields:fields});
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
  updateCompanyImages : function(result){
    var datas = [];
    if(this.state.pAuthData.StudioImages)
      datas = this.state.pAuthData.StudioImages.split(',');
    datas.push(result);
    var pAuthData = this.state.pAuthData;
    pAuthData.StudioImages = datas.toString();
    this.setState({pAuthData : pAuthData});
  },
  updateRealName : function(result){
    var data = this.state.pAuthData;
    data.RealName = result;
    this.setState({pAuthData : data})
  },
  onProvinceChange : function(result){
    var data = this.state.pAuthData;
    data.ProvinceId = result;
    this.setState({pAuthData : data});
  },
  onCityChange : function(result){
    var data = this.state.pAuthData;
    data.CityId = result;
    this.setState({pAuthData:data});
  },
  onDistrictChange : function(result){
    var data = this.state.pAuthData;
    data.CountyId = result;
    this.setState({pAuthData : data});
  },
  updateWorkPhone : function(result){
    var data = this.state.pAuthData;
    data.BusinessPhone = result;
    this.setState({pAuthData : data});
  },
  updateWechat : function(result){
    var data = this.state.pAuthData;
    data.Weixin = result;
    this.setState({pAuthData : data});
  },
  updateQQ : function(result){
    var data = this.state.pAuthData;
    data.Oicq = result;
    this.setState({pAuthData : data});
  },
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
  updateSign : function(result){
    var data = this.state.pAuthData;
    data.Signature = result;
    this.setState({pAuthData : data});
  },
  updateWorkLinks : function(result){
    var data = this.state.pAuthData;
    data.WorkLinks = result;
    this.setState({pAuthData : data});
  },
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
  updateCompanyLogo : function(result){
    var data = this.state.pAuthData;
    data.StudioLogo = result;
    this.setState({pAuthData : data});
  },
  updateCompanyAddress : function(result){
    var data = this.state.pAuthData;
    data.StudioAddress = result;
    this.setState({pAuthData : data});
  },
  updateCompanyIntro : function(result){
    var data = this.state.pAuthData;
    data.StudioIntroduction = result;
    this.setState({pAuthData: data});
  },
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
  removeCompanyImage : function(index){
    var data = this.state.pAuthData;
    var companyImages = data.StudioImages;
    if(companyImages && companyImages.length > 0){
      companyImages = companyImages.split(',');
      if(index < companyImages.length){
        companyImages.splice(index,1);
        data.StudioImages = companyImages.toString();
        this.setState({pAuthData : data});
      }
    }
  },
  /*
    验证所有输入是否合法
  */
  validate : function(){
    var message = '';
    if(!this.refs.realName.isValidated()){
      message = '请输入正确的姓名';
      return message;
    }
    if(!this.refs.area.getValue()){
      message = '请选择地区';
      return message;
    }
    if(!this.refs.workPhone.isValidated()){
      message = '请填写正确的电话号码';
      return message;
    }
    if(!this.refs.wechat.isValidated()){
      message = '请填写正确微信号码';
      return message;
    }
    if(!this.refs.qq.isValidated()){
      message = '请填写正确的qq号码';
      return message;
    }
    if(!this.refs.IDNumber.isValidated()){
      message = '请填写正确的身份证号码';
      return message;
    }
    //必须上传两个图片
    if(!this.refs.personIDImage.getValue()){
      message = '请上传身份证照片';
      return message;
    }
    if(!this.refs.personIntro.isValidated()){
      message = '个人简介必须在10字以上';
      return message;
    }
    if(!this.state.pAuthData.Works){
      message = '请至少上传一张个人作品';
      return message;
    }
    if(this.refs.hasCompany.getValue()){
      //如果有工作室，需要填全所有工作室的信息
      if(!this.refs.companyName.isValidated()){
        message = '请填写您的工作室名称';
        return message;
      }
      if(!this.refs.complanyLogo.getValue()){
        message = '请上传您的工作室logo';
        return message;
      }
      if(!this.refs.address.isValidated()){
        message = '请填写工作室的详细地址';
        return message;
      }
      if(!this.refs.companyIntro.isValidated()){
        message = '请填写工作室的简介';
        return message;
      }
      if(!this.state.pAuthData.StudioImages){
        message = "请上传工作室的照片";
        return message;
      }
    }
    return message;
  },
  showMessage : function(message) {
    this.refs.toolTip.toShow(message);
  },
  handleSubmit : function(){
    var message = this.validate();
    if(!message){
      var data = {
        RealName : this.state.pAuthData.RealName,
        BusinessLocation : this.state.pAuthData.CountyId?this.state.pAuthData.CountyId:this.state.pAuthData.CityId?this.state.pAuthData.CityId:this.state.pAuthData.ProvinceId,
        BusinessPhone : this.state.pAuthData.BusinessPhone,
        Weixin : this.state.pAuthData.Weixin,
        Oicq : this.state.pAuthData.Oicq,
        IdNumber : this.state.pAuthData.IdNumber,
        IdNumberImages : this.state.pAuthData.IdNumberImages,
        Signature : this.state.pAuthData.Signature,
        WorkLinks : this.state.pAuthData.WorkLinks,
        Works : this.state.pAuthData.Works,
        OwnedStudio : this.state.pAuthData.OwnedStudio,
        StudioName : this.state.pAuthData.StudioName,
        StudioLogo : this.state.pAuthData.StudioLogo,
        StudioAddress : this.state.pAuthData.StudioAddress,
        StudioIntroduction : this.state.pAuthData.StudioIntroduction,
        StudioImages : this.state.pAuthData.StudioImages
      };
      PAuthActions.submitAudit(data);
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
    if(this.state.authState == null){
      rightInfo = '未认证';
    }
    if(this.state.authState == '0'){
      rightInfo = '未审核';
    }
    if(this.state.authState == '1'){
      rightInfo = '审核通过';
    }
    if(this.state.authState == '2'){
      rightInfo = '审核不通过';
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
            textClassName="col-xs-4"
            placeholder="真实姓名2字以上"/>
          <AreaSelect ref="area"
            province = {this.state.pAuthData.ProvinceId}
            onProvinceChange={this.onProvinceChange}
            city = {this.state.pAuthData.CityId}
            onCityChange = {this.onCityChange}
            district = {this.state.pAuthData.CountyId}
            onDistrictChange = {this.onDistrictChange}
            disabled={this.state.disabled}/>
          <TextInput ref="workPhone"
            labelName="工作电话："
            value = {this.state.pAuthData.BusinessPhone}
            updateValue ={this.updateWorkPhone}
            minLength={5}
            disabled={this.state.disabled}
            textClassName="col-xs-4"
            placeholder=""/>
          <TextInput ref="wechat"
            labelName="微信："
            value = {this.state.pAuthData.Weixin}
            updateValue = {this.updateWechat}
            minLength={3}
            disabled={this.state.disabled}
            textClassName="col-xs-4"
            placeholder=""/>
          <TextInput ref="qq"
            labelName="QQ："
            value = {this.state.pAuthData.Oicq}
            updateValue = {this.updateQQ}
            minLength={5}
            disabled={this.state.disabled}
            textClassName="col-xs-4"
            placeholder=""/>
          <TextInput ref="IDNumber"
            labelName="身份证号码："
            value = {this.state.pAuthData.IdNumber}
            updateValue = {this.updatePersonID}
            minLength={15}
            disabled={this.state.disabled}
            textClassName="col-xs-4"
            placeholder=""/>
          <PersonIDImage ref="personIDImage"
            value = {this.state.pAuthData.IdNumberImages}
            upload1={this.updateIDImage1}
            upload2={this.updateIDImage2}
            disabled={this.state.disabled}/>
          <TextInput ref="personIntro"
            labelName="个性签名："
            value = {this.state.pAuthData.Signature}
            updateValue = {this.updateSign}
            minLength={10}
            disabled={this.state.disabled}
            textClassName="col-xs-4"
            placeholder="他很懒什么都没有留下"/>
          <TextInput ref="workLinks"
            labelName="个人作品链接："
            value = {this.state.pAuthData.WorkLinks}
            updateValue = {this.updateWorkLinks}
            minLength={15}
            disabled={this.state.disabled}
            textClassName="col-xs-4"
            placeholder=""/>
          <MultiImageSelect ref="works"
            uid = "worksSelect"
            labelName="个人作品："
            width="100"
            height="100"
            images={this.state.pAuthData.Works}
            disabled={this.state.disabled}
            maxCount={8}
            updateImages={this.updateProducts}
            remove={this.removeWorks}/>
          <HasCompany ref="hasCompany"
            disabled={this.state.disabled}
            checked={this.state.pAuthData.OwnedStudio}
            onChange={this.updateHasCompany}/>
          <TextInput ref="companyName"
            labelName="工作室名称："
            value = {this.state.pAuthData.StudioName}
            updateValue = {this.updateCompanyName}
            minLength={2}
            disabled={this.state.disabled}
            textClassName="col-xs-4"
            placeholder=""/>
          <CompanyLogo ref="complanyLogo"
            value = {this.state.pAuthData.StudioLogo}
            updateValue = {this.updateCompanyLogo}
            disabled={this.state.disabled} />
          <MultiImageSelect ref="companyImages"
            width="100"
            height="100"
            uid = "companyImagesSelect"
            disabled={this.state.disabled}
            maxCount={4}
            labelName="工作室照片："
            images={this.state.pAuthData.StudioImages}
            remove={this.removeCompanyImage}
            updateImages={this.updateCompanyImages}/>
          <TextInput ref="address"
            labelName="工作室地址："
            value = {this.state.pAuthData.StudioAddress}
            updateValue = {this.updateCompanyAddress}
            minLength={5}
            disabled={this.state.disabled}
            textClassName="col-xs-4"
            placeholder=""/>
          <TextInput ref="companyIntro"
            type="textarea"
            disabled={this.state.disabled}
            labelName="工作室简介："
            value = {this.state.pAuthData.StudioIntroduction}
            updateValue = {this.updateCompanyIntro}
            minLength={10}
            textClassName="col-xs-6"
            placeholder=""/>
          <Button className="col-xs-offset-2"
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
