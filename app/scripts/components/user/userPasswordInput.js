var React = require('react');
var Alert = require('react-bootstrap').Alert;
var validator = require('validator');


/*
  密码组件
*/
var UserPasswordInput = React.createClass({
  getInitialState : function(){
    return {
      password : '',
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
    var passwordValid = validator.isLength(event.target.value, 6,18);
    if(passwordValid){
      this.setState({message : '', validated : '1'});
    }else{
      this.setState({message : '密码长度为6-18', validated : '2'});
    }
  },
  render : function(){
    var classString = this.props.validatedClass(this.state.validated);
    return(
      <div className={classString}>
        <div className="col-sm-offset-2 col-sm-6">
          <input type="password" 
            className="form-control" 
            value= {this.props.password} 
            placeholder="用户密码" 
            id="userPasswordInput" 
            onBlur={this.handleBlur} 
            onChange={this.props.handleChange}/>
        </div>
        <label className="control-label col-sm-4">{this.state.message}</label>
      </div>
    );
  }
  
});

module.exports = UserPasswordInput;