var React = require('react');
var { Link } = require('react-router');
var TextInput = require('../account/textInput');

const AuthBasic = React.createClass({
  getInitialState: function(){
    return {
      pAuthData : {},
    }
  },
  updateRealName : function(result){
    var data = this.state.pAuthData;
    data.RealName = result;
    this.setState({pAuthData : data})
  },
  updatePersonID : function(result){
    var data = this.state.pAuthData;
    data.IdNumber = result;
    this.setState({pAuthData : data});
  },
  render: function() {
    return (
      <form className='form-horizontal'>
        <TextInput ref = "realName"
          labelName = "姓名："
          value = {this.state.pAuthData.RealName}
          updateValue = {this.updateRealName}
          minLength = {2}
          disabled = {this.state.disabled}
          textClassName = "col-xs-5"
          placeholder = "请输入您的真实姓名"
        />
        <TextInput ref = "IDNumber"
          labelName = "身份证号码："
          value = {this.state.pAuthData.IdNumber}
          updateValue = {this.updatePersonID}
          minLength = {15}
          disabled = {this.state.disabled}
          textClassName = "col-xs-5"
          placeholder = ""
        />
        <Link to="/account/pAuth/realname">下一步</Link>
      </form>
    )
  },
})

module.exports = AuthBasic;
