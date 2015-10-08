var React = require('react');
var Router = require('react-router');
var Link  = Router.Link;

var Input = require('react-bootstrap').Input;

var TextInput = React.createClass({
  getDefaultProps : function(){
    return{
      textClassName : 'col-sm-8',
      isRequired : true,
      minLength : 0,
      type : 'text'
    }
  },
  getInitialState : function(){
    return{
      validated : '0',
      value : '',
    }
  },
  validatedClass : function(){
    if(this.props.isRequired){
      if(this.state.value && this.state.value.length == 0){
        return '';
      }else{
        if(this.props.minLength > 0 && this.state.value.length < this.props.minLength){
          return 'error';
        }else{
          return 'success';
        }
      }
    }else{
      return '';
    }
  },
  handleChange : function(event){
    var textValue = this.refs.input.getValue();
    this.setState({value : textValue});
  },
  getValue : function(){
    return this.state.value;
  },
  render : function(){
    return (
      <Input type={this.props.type} 
        ref="input"
        value = {this.state.value}
        onChange={this.handleChange}
        bsStyle={this.validatedClass()} 
        label={this.props.labelName} 
        placeholder={this.props.placeholder} 
        labelClassName='col-xs-2' 
        wrapperClassName={this.props.textClassName}
        help={this.props.help}
        hasFeedback />
      );
  }
});

module.exports = TextInput;