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
      type : 'text',
      disabled : false,
      value : ''
    }
  },
  getInitialState : function(){
    return{
      validated : '0',
      value : '',
    }
  },
  componentDidMount : function(){
  },
  validatedClass : function(){
    if(this.props.isRequired){
      if(!this.props.value || this.props.value.length == 0){
        return '';
      }else{
        if(this.props.minLength > 0 && this.props.value.length < this.props.minLength){
          return 'error';
        }else{
          return 'success';
        }
      }
    }else{
      return '';
    }
  },
  isValidated : function(){
    if(this.props.isRequired){
      if(!this.props.value) return false;
      if(this.props.minLength > 0 && this.props.value.length < this.props.minLength){
        return false;
      }else{
        return true;
      }
    }
    return true;
  },
  handleChange : function(event){
    var textValue = this.refs.input.getValue();
    this.setState({value : textValue});
    this.props.updateValue(textValue);
  },
  getValue : function(){
    return this.state.value;
  },
  setValue : function(value){
    this.setState({value : value});
  },
  render : function(){
    return (
      <Input type={this.props.type}
        ref="input"
        value={this.props.value}
        onChange={this.handleChange}
        disabled={this.props.disabled}
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