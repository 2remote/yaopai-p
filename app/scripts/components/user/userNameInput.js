var React = require('react');
var Alert = require('react-bootstrap').Alert;
var validator = require('validator');

/*
  用户名文本组件，用于弹出登录框
*/
var UserNameInput = React.createClass({
  getInitialState : function(){
    return {
      userName : '',
      message : '',
      validated : '0'
    };
  },
  getDefaultProps : function(){
    return {
      validatedClass : function (validated){
        return "form-control";
      }
    }
  },
  handleBlur : function(event){
    var phoneNumberValid = validator.isMobilePhone(event.target.value, 'zh-CN');
    if(phoneNumberValid){
      this.setState({message : '', validated : '1'});
    }else{
      this.setState({message : '请输入正确的手机号码', validated : '2'});
    }
  },
  handleChange : function(event){
    this.state.userName = event.target.value;
  },
  render : function(){
    var classString = this.props.validatedClass(this.state.validated);
    return(
      <div className = {classString}>
        <div className="col-sm-offset-2 col-sm-6">
          <input type="text" 
            className="form-control" 
            value={this.props.userName} 
            placeholder="手机号码" 
            onBlur={this.handleBlur} 
            onChange={this.props.handleChange}/>
        </div>
        <label className="control-label col-sm-4">{this.state.message}</label>
      </div>
    );
  }
});

module.exports = UserNameInput;