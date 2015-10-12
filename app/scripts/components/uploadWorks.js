var React = require('react');
var Reflux = require('reflux');
var ReactAddons = require('react/addons');
var validator = require('validator');
var Panel = require('react-bootstrap').Panel;
var Button = require('react-bootstrap').Button;

var InfoHeader= require('./infoHeader');
var TextInput = require('./account/textInput');
var ChooseImage = require('./account/chooseImage');
var ChooseTag = require('./account/chooseTag');
var ToolTip = require('./toolTip');

var UploadWorksStore = require('../stores/UploadWorksStore');
var UploadWorksActions = require('../actions/UploadWorksActions');
/*
  选择类别组件
*/
var ChooseCategory = React.createClass({
  getDefaltProps : function(){
    return {
      value : 0,
      onChange : function(data){},
    }
  },
  setCategory : function(event){
    this.props.onChange(event.target.getAttribute('data-category'));
  },
  render : function(){
    return (
     <div className="form-group">
        <label className="control-label col-xs-2">类别：</label>
        <div className="col-xs-10">
          <div className="cont-category">
            <Button bsStyle={this.props.value=='1'?'primary':'default'} onClick={this.setCategory} data-category='1'>亲子</Button>
            <Button bsStyle={this.props.value=='2'?'primary':'default'} onClick={this.setCategory} data-category='2'>旅拍</Button>
            <Button bsStyle={this.props.value=='3'?'primary':'default'} onClick={this.setCategory} data-category='3'>商业</Button>
            <Button bsStyle={this.props.value=='4'?'primary':'default'} onClick={this.setCategory} data-category='4'>人像</Button>
            <Button bsStyle={this.props.value=='5'?'primary':'default'} onClick={this.setCategory} data-category='5'>私房</Button>
            <Button bsStyle={this.props.value=='6'?'primary':'default'} onClick={this.setCategory} data-category='6'>婚纱</Button>
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
*/
var UploadWorks = React.createClass({
  mixins : [Reflux.listenTo(UploadWorksStore,'onStoreChanged')],
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
  onStoreChanged : function(data){
    if(data.flag == 'add'){
      //处理提交新相册
      console.log(data);
    }
    if(data.flag == 'get'){
      //处理get请求结果
    }
    if(data.flag == 'update'){
      //处理更新后的结果
    }
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
      var photos =[];
      this.state.photos.map(function(photo,i){
        photos[i] = {Url : photo.Url,Description : photo.Description};
      });
      var data = {
        Title : this.state.title,
        Photos : photos,
        CategoryId : parseInt(this.state.category),
        Description : this.state.description,
        Service : this.state.service,
        Price : this.state.price,
        Cover : this.state.photos[this.state.cover].Url
      }
      UploadWorksActions.add(data);
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
            updateValue={this.updatePhotos}
            cover={this.state.cover}
            updateCover={this.updateCover}/>
          <ChooseCategory value={this.state.category} onChange = {this.updateCategory}/>
          <ChooseTag value={this.state.tags} updateTags={this.updateTags}/>
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
            value={this.state.price}
            updateValue={this.updatePrice}
            placeholder="¥面议"/>
          <div className="row">
            <Button onClick={this.handleSubmit}>提交</Button>
            <Button>预览</Button>
            <ToolTip ref="toolTip" title=""/>
          </div>
        </form>
      </div>
    );
  }
});

module.exports = UploadWorks;
