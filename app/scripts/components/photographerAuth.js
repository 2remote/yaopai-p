var React = require('react');
var Router = require('react-router');
var Link  = Router.Link;
var Reflux = require('reflux');
var UserStore = require('../stores/UserStore');

var validator = require('validator');
var UserNameInput = require('./user/userNameInput');
var UserPasswordInput = require('./user/userPasswordInput');
var AlertBox = require('./user/alertBox');

var Panel = require('react-bootstrap').Panel;
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;

var TextInput = require('./account/textInput');
var ImageInput = require('./account/imageInput');
var AreaSelect = require('./account/areaSelect');

var UserActions = require('../actions/UserActions');
var PAuthActions = require('../actions/PAuthActions');

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
    return (
      <div className="form-group">
        <label className="control-label col-xs-2">身份证正反面：</label>
        <div className="col-xs-10">
          <div className="row">
            <ImageInput uid="IDPicture1" ref="IDPicture1" type="user"/>
            <ImageInput uid="IDPicture2" ref="IDPicture2" type="user"/>
          </div>

          <div className="row">
            <div className="col-xs-6">
              <img height="150" src="img/id_shili.png" />
            </div>
            <div className="col-xs-6">
              <div>
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


var PersonProduct = React.createClass({
  getDefaultProps : function(){
    return {
      products : [],
      updateProducts : function(result){}
    }
  },
  componentDidMount : function() {
  },
  onUpload : function(imageUrl){
    this.props.updateProducts(imageUrl);
    this.refs.addImage.setState({imageUrl : ''}); //清空图片
  },
  render : function(){
    var renderProducts = this.props.products.map(function(prod,i){
      return (
        <img width="120" src={prod.imgUrl} />
      )
    });
    return (
      <div className="form-group">
        <label className="control-label col-xs-2">个人作品：</label>
          <div className="col-xs-10">
          {renderProducts}
          <ImageInput uid="chooseProduct" ref="addImage" defaultImage="img/tianjia.png" onUpload={this.onUpload}/>
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
  render : function () {
    return (
      <div className="form-group">
        <label className="control-label col-xs-2">工作室LOGO：</label>
        <div className="col-xs-6">
          <ImageInput uid="complanyLogo" defaultImage = "img/logo_up.png" type="user"/>
        </div>
      </div>
      );
  }
});

var CompnayIntro = React.createClass({
  render : function(){
    return (
      <div className="form-group">
        <Input type="textarea" label="工作室简介：" labelClassName='col-xs-2' wrapperClassName="col-xs-6"/>
      </div>
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
      if(!this.refs.companyIntro.isValidated()){
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
  getWorks : function(){
    var works = '';
    for(var i = 0 ;i < this.state.products.length; i ++){
      if(i == this.state.products.length-1)
        works = works + this.state.products[i].imageUrl;
      else
        works =works + this.state.products[i].imageUrl +',';
    }
    return works;
  },
  getCompanyImages : function(){
    var images = '';
    for(var i = 0 ;i < this.state.companyImages.length; i ++){
      if(i == this.state.companyImages.length-1)
        images = works + this.state.companyImages[i].imageUrl;
      else
        images =works + this.state.companyImages[i].imageUrl +',';
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
      console.log(message);
    }
  },
  render: function() {

    return (
          <Panel>
            <AuthHeader />
            <form className='form-horizontal'>
              <TextInput ref="realName" labelName="姓名：" minLength={2} placeholder="真实姓名2字以上"/>
              <AreaSelect ref="area"/>
              <TextInput ref="workPhone" labelName="工作电话：" minLength={5} placeholder=""/>
              <TextInput ref="wechat" labelName="微信：" minLength={3} placeholder=""/>
              <TextInput ref="qq" labelName="QQ：" minLength={5} placeholder=""/>
              <TextInput ref="IDNumber" labelName="身份证号码：" minLength={15} placeholder=""/>
              <PersonIDImage ref="personIDImage"/>
              <TextInput ref="personIntro" labelName="个性签名：" minLength={10} placeholder="他很懒什么都没有留下"/>
              <TextInput ref="workLinks" labelName="个人作品链接：" minLength={15} placeholder=""/>
              <PersonProduct ref="works" products={this.state.products} updateProducts={this.updateProducts}/>
              <HasCompany ref="hasCompany"/>
              <TextInput ref="companyName" labelName="工作室名称：" minLength={3} placeholder=""/>
              <CompanyLogo ref="complanyLogo"/>
              <TextInput ref="address" labelName="工作室地址：" minLength={5} placeholder=""/>
              <CompnayIntro ref="companyIntro"/>
              <Button bsStyle="primary" onClick={this.handleSubmit}>提交</Button>
            </form>
          </Panel>
    );
  }
});

module.exports = PhotographerAuth;
