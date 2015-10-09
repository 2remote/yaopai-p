var React = require('react');
var Router = require('react-router');
var Link  = Router.Link;
var Reflux = require('reflux');
var UserStore = require('../stores/UserStore');

var validator = require('validator');
var UserNameInput = require('./user/userNameInput');
var UserPasswordInput = require('./user/userPasswordInput');
var AlertBox = require('./user/alertBox');
var InfoHeader = require('./infoHeader');

var Panel = require('react-bootstrap').Panel;
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;

var TextInput = require('./account/textInput');
var ImageInput = require('./account/imageInput');
var AreaSelect = require('./account/areaSelect');
var ToolTip = require('./toolTip');

var UserActions = require('../actions/UserActions');
var PAuthActions = require('../actions/PAuthActions');
var PAuthStore = require('../stores/PAuthStore');

var AuthHeader = React.createClass({
  render : function(){
    return (
      <div className="row">
        <div className="col-sm-8">
          <span><h3>摄影师认证</h3></span>
        </div>
        <div className="col-sm-4">
          <span>未认证</span>
        </div>
        <div className="line">
        </div>
      </div>
      )
  }
});



var ContactPhone = React.createClass({
  render : function(){
    return(
      <TextInput labelName="工作电话：" placeholderName=""/>

      );
  }
});
var QQNumber = React.createClass({
  render : function(){
    return(
      <TextInput labelName="QQ：" placeholderName=""/>
      );
  }
});



var PersonIntro = React.createClass({
  render : function(){
    return(
      <TextInput ref="RealName" labelName="个人简介：" minLength={5} placeholder="他很懒什么都没有留下"/>

      );
  }
});

var CompanyName = React.createClass({
  render : function(){
    return(
      <TextInput ref="RealName" labelName="工作室名称：" minLength={5} placeholder=""/>

      );
  }
});

var Address = React.createClass({
  render : function(){
    return(
      <TextInput labelName="详细地址：" placeholderName="" minLength={8} />

      );
  }
});

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
    return (
      <div className="form-group">
        <label className="control-label col-xs-2" style={style.label}>身份证正反面：</label>
        <div className="col-xs-10">
          <div className="row" style={style.imgId}>
            <ImageInput width="200" height="150" defaultImage="img/facecode.png" uid="IDPicture1" ref="IDPicture1" type="user"/>
            <ImageInput width="200" height="150" defaultImage="img/opposite.png" uid="IDPicture2" ref="IDPicture2" type="user"/>
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


var MultiImageSelect = React.createClass({
  getDefaultProps : function(){
    return {
      updateImages : function(result){},
      labelName : '',
      images : [],
      uid : 'multiImageSelect',
      width: '150px',
      height: '150px',
    }
  },
  componentDidMount : function() {
  },
  onUpload : function(imageUrl){
    this.props.updateImages(imageUrl);
    this.refs.addImage.setState({imageUrl : ''}); //清空图片
  },
  render : function(){
    var renderProducts = this.props.images.map(function(prod,i){
      return (
        <img width="120" src={prod.imgUrl} />
      )
    });
    return (
      <div className="form-group">
        <label className="control-label col-xs-2">{this.props.labelName}</label>
          <div className="col-xs-10">
          {renderProducts}
          <ImageInput width={this.props.width} height={this.props.height} uid={this.props.uid} ref="addImage" defaultImage="img/tianjia.png" onUpload={this.onUpload}/>
        </div>
      </div>
      )
  }
});


var HasCompany = React.createClass({
  getInitialState : function(){
    return {
      checked : false
    }
  },
  onChange : function(event){
    this.setState({checked : event.target.checked});
  },
  getValue : function(){
    return this.state.checked;
  },
  render : function (){
    return (
      <div className= "form-group">
        <label className="control-label col-xs-2">是否有工作室：</label>
        <input type="checkbox" ClassName="col-xs-6" onChange={this.onChange}/>
      </div>
    );
  }
});
var CompanyLogo = React.createClass({
  getValue : function () {
    return this.refs.companyLogo.getValue();
  },
  render : function () {
    var style = {
      label: {
        lineHeight: '120px',
      }
    };
    return (
      <div className="form-group">
        <label className="control-label col-xs-2" style={style.label}>工作室LOGO：</label>
        <div className="col-xs-6">
          <ImageInput width="200" height="120" uid="companyLogo" ref="companyLogo" defaultImage = "img/logo_up.png" type="user"/>
        </div>
      </div>
    );
  }
});

var CompnayIntro = React.createClass({
  getValue : function () {
    return this.refs.companyIntro.getValue();
  },
  render : function(){
    return (
      <Input type="textarea" ref="companyIntro" label="工作室简介：" labelClassName='col-xs-2' wrapperClassName="col-xs-6"/>
      );
  }
});

var PhotographerAuth = React.createClass({
  getInitialState: function(){
    return {
      authState : '0',
      products : [],
      companyImages : [],
    }
  },
  updateProducts : function(result){
    var datas = this.state.products;
    datas.push({imgUrl : result});
    this.setState({products : datas});
  },
  updateCompanyImages : function(result){
    var datas = this.state.companyImages;
    datas.push({imgUrl : result});
    this.setState({companyImages : datas});
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
    if(!this.getWorks()){
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
      if(!this.refs.companyIntro.getValue()){
        message = '请填写工作室的简介';
        return message;
      }
      if(!this.getCompanyImages()){
        message = "请上传工作室的照片";
        return message;
      }
    }
    return message;
  },
  showMessage : function(message) {
    this.refs.toolTip.toShow(message);
  },
  getWorks : function(){
    var works = '';
    for(var i = 0 ;i < this.state.products.length; i ++){
      if(i == this.state.products.length-1)
        works = works + this.state.products[i].imgUrl;
      else
        works =works + this.state.products[i].imgUrl +',';
    }
    return works;
  },
  getCompanyImages : function(){
    var images = '';
    for(var i = 0 ;i < this.state.companyImages.length; i ++){
      if(i == this.state.companyImages.length-1)
        images = images + this.state.companyImages[i].imgUrl;
      else
        images =images + this.state.companyImages[i].imgUrl +',';
    }
    return images;
  },
  handleSubmit : function(){
    var message = this.validate();
    if(!message){
      var data = {
        RealName : this.refs.realName.getValue(),
        BusinessLocation : this.refs.area.getValue(),
        BusinessPhone : this.refs.workPhone.getValue(),
        Weixin : this.refs.wechat.getValue(),
        IdNumber : this.refs.IDNumber.getValue(),
        IdNumberImages : this.refs.personIDImage.getValue(),
        Signature : this.refs.personIntro.getValue(),
        WorkLinks : this.refs.workLinks.getValue(),
        Works : this.getWorks(),
        OwnedStudio : this.refs.hasCompany.getValue(),
        StudioName : this.refs.companyName.getValue(),
        StudioLogo : this.refs.complanyLogo.getValue(),
        StudioAddress : this.refs.address.getValue(),
        StudioIntroduction : this.refs.companyIntro.getValue(),
        StudioImages : this.getCompanyImages()
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
    return (
          <div style={style.outer}>
            <InfoHeader infoTitle="摄影师认证" rightInfo="未认证" infoIconClass="glyphicon glyphicon-camera"/>
            <form className='form-horizontal'>
              <TextInput ref="realName"
                labelName="姓名："
                minLength={2}
                textClassName="col-xs-4"
                placeholder="真实姓名2字以上"/>
              <AreaSelect ref="area"/>
              <TextInput ref="workPhone"
                labelName="工作电话："
                minLength={5}
                textClassName="col-xs-4"
                placeholder=""/>
              <TextInput ref="wechat"
                labelName="微信："
                minLength={3}
                textClassName="col-xs-4"
                placeholder=""/>
              <TextInput ref="qq"
                labelName="QQ："
                minLength={5}
                textClassName="col-xs-4"
                placeholder=""/>
              <TextInput ref="IDNumber"
                labelName="身份证号码："
                minLength={15}
                textClassName="col-xs-4"
                placeholder=""/>
              <PersonIDImage ref="personIDImage"/>
              <TextInput ref="personIntro"
                labelName="个性签名："
                minLength={10}
                textClassName="col-xs-4"
                placeholder="他很懒什么都没有留下"/>
              <TextInput ref="workLinks"
                labelName="个人作品链接："
                minLength={15}
                textClassName="col-xs-4"
                placeholder=""/>
              <MultiImageSelect ref="works"
                uid = "worksSelect"
                labelName="个人作品："
                images={this.state.products}
                updateImages={this.updateProducts}/>
              <HasCompany ref="hasCompany"/>
              <TextInput ref="companyName"
                labelName="工作室名称："
                minLength={3}
                textClassName="col-xs-4"
                placeholder=""/>
              <CompanyLogo ref="complanyLogo"/>
              <MultiImageSelect ref="companyImages"
                width="100px"
                height="100px"
                uid = "companyImagesSelect"
                labelName="工作室照片："
                images={this.state.companyImages}
                updateImages={this.updateCompanyImages}/>
              <TextInput ref="address"
                labelName="工作室地址："
                minLength={5}
                textClassName="col-xs-4"
                placeholder=""/>
              <CompnayIntro ref="companyIntro"/>
              <Button className="col-xs-offset-2" bsStyle="primary" onClick={this.handleSubmit}>提交</Button>
              <ToolTip ref="toolTip" title=""/>
            </form>
          </div>
    );
  }
});

module.exports = PhotographerAuth;
