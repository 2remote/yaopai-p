var React = require('react');
var ReactAddons = require('react/addons');

var Panel = require('react-bootstrap').Panel;
var Button = require('react-bootstrap').Button;

var AccountHeader = require('./account/accountHeader');
var TextInput = require('./account/textInput');
var ChooseImage = require('./account/chooseImage');
var ChooseTag = require('./account/chooseTag');
/*
  选择类别组件
*/
var ChooseCategory = React.createClass({
  render : function(){
    return (
     <div className="form-group">
        <label className="control-label col-xs-2">类别：</label>
        <div className="col-xs-10">
          <div className="cont-category">
            <span>亲子</span>
            <span>旅拍</span>
            <span>商业</span>
            <span>人像</span>
            <span>私房</span>
            <span>婚纱</span>
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
  getInitialState : function(){
    return {
      title : '',
      category : '',
      description : '',
      service : '',
      price : 0 ,
      cover : '',
      photos : [],
    }
  },
  updatePhotos : function(){

  },
  updateCategory : function(cid){
    this.setState({category : cid});
  },
  updateTags : function(tags){

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
  handleSubmit : function(){

  },
  render: function() {

    return (
      <Panel>
        <AccountHeader titleName="上传作品" titleImage="" />
        <form className='form-horizontal'>
          <TextInput ref="workName" labelName="作品名称：" minLength={5} placeholder="名称应该在5-25字之间"/>
          <ChooseImage value={this.state.photos} updateValue={this.updatePhotos} />
          <ChooseCategory value={this.state.category} updateCategory = {this.updateCategory}/>
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
          </div>
        </form>
      </Panel>
    );
  }
});

module.exports = UploadWorks;
