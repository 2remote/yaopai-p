var React = require('react');

var Panel = require('react-bootstrap').Panel;
var Button = require('react-bootstrap').Button;
var AccountHeader = require('./account/accountHeader');
var TextInput = require('./account/textInput');
var ChooseImage = require('./account/ChooseImage');

/*
  选择类别组件
*/
var ChooseCategory = React.createClass({
  render : function(){
    return (
     <div className="form-group">
        <label className="control-label col-xs-2">类别：</label>
        <div className="col-xs-10">
          <div className="row">
            
          </div>
        </div>
      </div>
      );
  }
});

/*
  选择标签组件
*/
var ChooseTag = React.createClass({
  render : function(){
    return(
      <div className="form-group">
        <label className="control-label col-xs-2">标签：</label>
        <div className="col-xs-10">
          <div className="row">
            
          </div>
        </div>
      </div>
      )
  }
});
/*
  上传作品组件
  用到通用的用户组件 ./account/*
    AccountHeader 
    TextInput
*/
var UploadWorks = React.createClass({

  render: function() {

    return (
      <Panel>
        <AccountHeader titleName="上传作品" titleImage="" />
        <form className='form-horizontal'>
          <TextInput ref="workName" labelName="作品名称：" minLength={5} placeholder="名称应该在5-25字之间"/>
          <ChooseImage />
          <ChooseCategory />
          <TextInput ref="workDescription" 
            type="textarea" 
            labelName="作品简述：" 
            minLength={15} 
            maxLength={1000}
            placeholder=""
            help="作品描述应该在15-1000字之间" />
          <TextInput ref="service" 
            type="textarea" 
            labelName="提供服务：" 
            minLength={15} 
            maxLength={1000}
            placeholder=""
            help="服务描述应该在15-1000字之间" />
          <TextInput ref="price"  
            labelName="是否定价：" 
            placeholder="¥面议"/>
          <div className="row">
            <Button>提交</Button>
            <Button>预览</Button>
          </div>
        </form>
      </Panel>
    );
  }
});

module.exports = UploadWorks;
