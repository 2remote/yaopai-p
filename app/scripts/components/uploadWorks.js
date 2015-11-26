var React = require('react');
var Reflux = require('reflux');
var ReactAddons = require('react/addons');
var validator = require('validator');
var Panel = require('react-bootstrap').Panel;
var Button = require('react-bootstrap').Button;

var InfoHeader= require('./infoHeader');
var TextInput = require('./account/textInput');
var ChooseImage = require('./account/chooseImage');
var ToolTip = require('./toolTip');

var AlbumsStore = require('../stores/AlbumsStore');
var AlbumsActions = require('../actions/AlbumsActions');
var WorkStore = require('../stores/WorkStore');
var UserActions = require("../actions/UserActions");
var UserStore = require("../stores/UserStore");
var History = require('react-router').History;
/*
  选择类别组件
*/
var ChooseCategory = React.createClass({
  mixins : [Reflux.listenTo(AlbumsStore,'onGetCategories')],
  getInitialState : function(){
    return {
      categories : []
    }
  },
  getDefaltProps : function(){
    return {
      value : 0,
      onChange : function(data){},
    }
  },
  componentWillMount : function(){
    AlbumsActions.getCategories({Fields:'Id,Name,Sorting,Display,Views'});
  },
  onGetCategories : function(data){
    if(data.hintMessage){
      console.log(data.hintMessage);
    }else{
      this.setState({categories : data.categories});
    }
  },
  setCategory : function(event){
    this.props.onChange(event.target.getAttribute('data-category'));
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
    var buttons = this.state.categories.map(function(item,i){
      return(<Button key={i} bsStyle={this.props.value==item.Id?'primary':'default'} style={style.button} onClick={this.setCategory} data-category={item.Id}>{item.Name}</Button>);
    }.bind(this));
    return (
     <div className="form-group">
        <label className="control-label col-xs-2">类别：</label>
        <div className="col-xs-10">
          <div className="cont-category">
            {buttons}
          </div>
        </div>
      </div>
      );
  }
});



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
      cover : -1,
      photos : [],
      tags : []
    }
  },
  isLogin: function (data) {
    if (!data.isLogin) {
      //没有登录跳转到首页登录界面
      UserActions.logout(true);
      this.history.pushState(null, '/');
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
          cover : -1,
          photos : [],
          tags : []
        });
        //同时要清空WorkStore的数据
        this.refs.chooseImage.clearImage();
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
    //处理封面
    var cover = -1;
    for(var i =0 ; i < data.length ; i ++){
      if(data[i].isCover) cover = i;
    }
    this.setState({photos : data,cover : cover});
  },
  updateTitle : function(title){
    this.setState({title: title});
  },
  updatePhotos : function(photos){
    this.setState({photos : photos});
  },
  updateCategory : function(cid){
    this.setState({category : cid});
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
  validate : function(){
    if(this.state.title.length < 5 || this.state.title.length > 25){
      this.showMessage('作品名称必须在5-25字之间');
      return false;
    }
    if(this.state.photos.length == 0){
      this.showMessage('请至少上传一张作品');
      return false;
    }
    if(!this.state.category){
      this.showMessage('请选择作品类别');
      return false;
    }
    if(this.state.description.length < 15 || this.state.description.length > 1000){
      this.showMessage('作品描述必须在15-1000字之间');
      return false;
    }
    if(this.state.service.length < 15 || this.state.service.length > 1000){
      this.showMessage('服务描述必须在15-1000字之间');
      return false;
    }
    if(this.state.price && !validator.isInt(this.state.price)){
      this.showMessage('如果填写价格，必须为数字');
      return false;
    }
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
        CategoryId : parseInt(this.state.category),
        Description : this.state.description,
        Service : this.state.service,
        Price : this.state.price,
        Negotiable : this.state.price==0?true:false,
        Cover : this.state.photos[this.state.cover].Url
      }
      //针对后端要求，序列化数组
      this.state.photos.map(function(photo,i){
        data['photos['+i+'].Url'] = photo.Url;
        data['photos['+i+'].Description'] = photo.Description;
      });
      AlbumsActions.add(data);
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
        border: '1px solid #337ab7',
        backgroundColor: '#337ab7',
        color: '#fff',
        fontSize: '20px',
      },
      preview: {
        width: '20%',
        height: '50px',
        border: '1px solid #337ab7',
        color: '#337ab7',
        fontSize: '20px',
      },
      bottomWrap: {
        textAlign: 'center',
      }
    };
    return (
      <div style={style.outer}>
        <InfoHeader infoTitle="作品上传"infoIconClass="glyphicon glyphicon-picture" titleImage="" />
        <form className='form-horizontal'>
          <TextInput ref="workName"
            labelName="作品名称："
            value = {this.state.title}
            updateValue = {this.updateTitle}
            minLength={5}
            placeholder="名称应该在5-25字之间"/>
          <ChooseImage value={this.state.photos}
            ref="chooseImage"/>
          <ChooseCategory value={this.state.category} onChange = {this.updateCategory}/>
          <TextInput ref="workDescription"
            type="textarea"
            value = {this.state.description}
            updateValue = {this.updateDescription}
            labelName="作品简述："
            minLength={15}
            maxLength={1000}
            placeholder=""
            help="作品描述应该在15-1000字之间" />
          <TextInput ref="service"
            type="textarea"
            value={this.state.service}
            updateValue={this.updateService}
            labelName="提供服务："
            minLength={15}
            maxLength={1000}
            placeholder=""
            help="服务描述应该在15-1000字之间" />
          <TextInput ref="price"
            labelName="是否定价："
            textClassName="col-xs-4"
            value={this.state.price}
            updateValue={this.updatePrice}
            placeholder="¥面议"/>
          <div className="row" style={style.bottomWrap}>
            <Button style={style.submitButton} onClick={this.handleSubmit}>提交</Button>
            <Button style={style.preview}>预览</Button>
            <ToolTip ref="toolTip" title=""/>
          </div>
        </form>
      </div>
    );
  }
});

module.exports = UploadWorks;
