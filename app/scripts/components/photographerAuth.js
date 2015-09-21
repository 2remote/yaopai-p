var React = require('react');
var Router = require('react-router');
var Link  = Router.Link;
var Reflux = require('reflux');
var UserStore = require('../stores/UserStore');

var validator = require('validator');
var UserActions = require('../actions/UserActions');
var UserNameInput = require('./user/userNameInput');
var UserPasswordInput = require('./user/userPasswordInput');
var AlertBox = require('./user/alertBox');

var Panel = require('react-bootstrap').Panel;
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;

var TextInput = require('./account/textInput');
var ImageInput = require('.//account/imageInput');

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

/*
var TextInput = React.createClass({
  getDefaultProps : function(){
    return{
      textClassName : 'col-sm-4',
      validatedClass : ''
    }
  },
  render : function(){
    return (
      <Input type="text" 
        bsStyle={this.props.validatedClass} 
        label={this.props.labelName} 
        placeholder={this.props.placeholderName} 
        labelClassName='col-xs-2' 
        wrapperClassName={this.props.textClassName}
        hasFeedback />
      );
  }
});
*/

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

var PersonIDNumber = React.createClass({
  render : function(){
    return(
      <TextInput ref="RealName" labelName="身份证号码：" minLength={5} placeholder=""/>

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

var Province = React.createClass({
  render : function(){
    return(
      <div className="form-group">
        <Input type="select" label="地区：" labelClassName='col-xs-2' wrapperClassName="col-xs-6">
          <option value="1">郑州</option>
        </Input>
      </div>

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
  chooseIDPicture1 : function () {
    React.findDOMNode(this.refs.IDPicture1).click();
  },
  handleIDPicture1 : function () {
    var fileinput = React.findDOMNode(this.refs.IDPicture1);
    console.log(fileinput.value);
  },
  chooseIDPicture2 : function () {
    React.findDOMNode(this.refs.IDPicture2).click();
  },
  handleIDPicture2 : function () {
    var fileinput = React.findDOMNode(this.refs.IDPicture2);
    console.log(fileinput.value);
  },
  render : function(){
    return (
      <div className="form-group">
        <label className="control-label col-xs-2">身份证正反面：</label>
        <div className="col-xs-10">
          <div className="row">
            <ImageInput ref="IDPicture1" />
            <ImageInput ref="IDPicture2" />
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

  /*
    读取成功后加载Image
  */
  fileLoaded : function(event) {
    this.props.updateProducts(event.target.result);
  },
  selectImage : function(event){
    if(event.target.files && event.target.files[0]) {
      console.log(event.target.files);
      for(var i = 0 ; i < event.target.files.length;i++){
        var fr = new FileReader();
        fr.onload = this.fileLoaded;
        fr.readAsDataURL(event.target.files[i]);
      }
    }
  },
  handleClick : function(){
    React.findDOMNode(this.refs.imageFile).click();
  },
  render : function(){
    var renderProducts = this.props.products.map(function(prod,i){
      return (
        <ImageInput defaultImage={prod.imgUrl} />
      )
    });
    return (
      <div className="form-group">
        <label className="control-label col-xs-2">个人作品：</label>
          <div className="col-xs-10">
          {renderProducts}
          <img className="image-button" src="img/tianjia.png" onClick={this.handleClick}/>
          <input type="file" ref="imageFile" className="hidden" onChange={this.selectImage} multiple="multiple" />
        </div>
      </div>
      )
  }
});

var hasCompany = React.createClass({
  render : function () {
    return (
      <div className= "form-group">
        <label className="control-label col-xs-2">是否有工作室：</label>
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
          <ImageInput defaultImage = "img/logo_up.png" />
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
    }
  },
  updateProducts : function(result){
    var datas = this.state.products;
    datas.push({imgUrl : result});
    this.setState({products : datas});
  },
  render: function() {

    return (
          <Panel>
            <AuthHeader />
            <form className='form-horizontal'>
              <TextInput ref="RealName" labelName="姓名：" minLength={2} placeholder="真实姓名2字以上"/>
              <TextInput ref="RealName" labelName="工作电话：" minLength={5} placeholder=""/>
              <TextInput ref="RealName" labelName="微信：" minLength={3} placeholder=""/>
              <TextInput ref="RealName" labelName="QQ：" minLength={5} placeholder=""/>
              <PersonIDImage />
              <PersonIntro />
              <PersonProduct products={this.state.products} updateProducts={this.updateProducts}/>
              <CompanyName />
              <CompanyLogo />
              <Province />
              <Address />
              <CompnayIntro />
              <Button bsStyle="primary">提交</Button>
            </form>
          </Panel>
    );
  }
});

module.exports = PhotographerAuth;
