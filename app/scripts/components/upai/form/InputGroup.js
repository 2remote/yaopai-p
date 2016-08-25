import React, { PropTypes } from 'react'
/**
 * InputGroup是借用Bootstrap的思想来做一个带label的input
 * Bootstrap中的InputGroup有2种：
 * 应用于一般情况的：
 * <div class="form-group">
 *   <label for="exampleInputEmail1">Email address</label>
 *   <input type="email" class="form-control" id="exampleInputEmail1" placeholder="Email">
 * </div>
 * <div class="form-group">
 *   <label for="inputEmail3" class="col-sm-2 control-label">Email</label>
 *   <div class="col-sm-10">
 *     <input type="email" class="form-control" id="inputEmail3" placeholder="Email">
 *   </div>
 * </div>
 * TODO:
 * 1. validation states
 * 2. addon
**/

const supportedInputTypes = {
  text: 1,
  password: 1,
  number: 1,
  email: 1,
  url: 1,
  tel: 1,
  radio: 0,
  checkbox: 0,
  textarea: 0,
  /* not for input */
  static: 1,
  /* use props.children */
  children: 1,
}

const InputGroup = React.createClass({
  render() {
    const {
      label,
      inputId,
      type,
      horizontalLabelStyle,
      horizontalInputStyle,
      staticContent,
      helpText,
      hasFeedback,
      value,
      updateValue,
    } = this.props
    if(!this.validateSupport()) {
      return null
    }
    let nameMyInput = (
      <input className="form-control" id={ inputId } type={ type }
        value={ value }
        onChange={ e => updateValue(e.target.value, e) }
      >
        { helpText ? (
          <span className="help-block">{ helpText }</span>
        ) : null}
      </input>
    )
    if(type === 'static') {
      nameMyInput = <p className="form-control-static">{ staticContent }</p>
    }
    if(type === 'children')  {
      nameMyInput = this.props.children
    }
    if(horizontalInputStyle) {
      nameMyInput = (
        <div className={horizontalInputStyle}>
          { nameMyInput }
        </div>
      )
    }
    return (
      <div className={`form-group${hasFeedback ? 'has-feedback' : ''}`}>
        <label htmlFor={ inputId } className={ `${horizontalLabelStyle} control-label` }>{ label }</label>
        { nameMyInput }
      </div>
    )
  },
  validateSupport() {
    if(!supportedInputTypes[this.props.type]) {
      console.warn(
        `Unsupported input type[${this.props.type}]! Supported input type config is:`,
        supportedInputTypes
      )
      return false
    }
    return true
  },
})

InputGroup.propTypes = {
  label: PropTypes.string,
  inputId: PropTypes.string,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  horizontalLabelStyle: PropTypes.string,
  horizontalInputStyle: PropTypes.string,
  staticContent: PropTypes.string,
  helpText: PropTypes.string,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  required: PropTypes.bool,
  hasFeedback: PropTypes.bool,
  value: PropTypes.any,
  updateValue: PropTypes.func,
}

export default InputGroup
