import React, { PropTypes } from 'react'
import _ from 'lodash'
import { warn } from 'util/logger'
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

const INPUT_STATUS = {
  DEFAULT: 'input_status_default',
  SUCCESS: 'input_status_success',
  WARNING: 'input_status_warning',
  ERROR: 'input_status_error',
}

const feedbackStatus = (value, { min, max, required }) => {
  if (_.isUndefined(value)) {
    return INPUT_STATUS.DEFAULT
  }
  // is required?
  if (!value && (required || min)) {
    return INPUT_STATUS.ERROR
  }
  // check minimum
  if (value && min && value.length < min) {
    return INPUT_STATUS.ERROR
  }
  // check maximum
  if (value && max && value.length > max) {
    return INPUT_STATUS.ERROR
  }

  return INPUT_STATUS.SUCCESS
}

const feedbackStyle = (status) => {
  if (status === INPUT_STATUS.SUCCESS) {
    return { formGroup: 'has-success', glyphicon: 'glyphicon-ok' }
  }
  if (status === INPUT_STATUS.WARNING) {
    return { formGroup: 'has-warning', glyphicon: 'glyphicon-warning-sign' }
  }
  if (status === INPUT_STATUS.ERROR) {
    return { formGroup: 'has-error', glyphicon: 'glyphicon-remove' }
  }
  return { formGroup: '', glyphicon: '' }
}

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
  propTypes: {
    label: PropTypes.string,
    inputId: PropTypes.string,
    type: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    horizontalLabelStyle: PropTypes.string,
    horizontalInputStyle: PropTypes.string,
    staticContent: PropTypes.string,
    minLength: PropTypes.number,
    maxLength: PropTypes.number,
    required: PropTypes.bool,
    hasFeedback: PropTypes.bool,
    helpText: PropTypes.string,
    value: PropTypes.any,
    updateValue: PropTypes.func,
    children: PropTypes.node,
  },

  render() {
    const {
      label,
      inputId,
      type,
      horizontalLabelStyle,
      horizontalInputStyle,
      staticContent,
      minLength,
      maxLength,
      required,
      hasFeedback,
      helpText,
      value,
      updateValue,
      placeholder,
    } = this.props

    if (!this.validateSupport()) {
      return null
    }

    // deal with feedback
    const feedback = feedbackStyle(feedbackStatus(value, {
      min: minLength,
      max: maxLength,
      required,
    }))

    // TODO: feedback: how to add it?
    const feedbackIcon = hasFeedback && feedback.glyphicon ? (
      <span
        className={`glyphicon ${feedback.glyphicon} form-control-feedback`}
        aria-hidden="true"
      />
    ) : null

    let nameMyInput = [(
      <input
        className="form-control"
        placeholder={placeholder}
        id={inputId}
        type={type}
        value={value}
        onChange={e => updateValue(e.target.value, e)}
      />
    ), feedbackIcon, (hasFeedback && helpText ? (
      <span className="help-block">{ helpText }</span>
    ) : null
    )]

    if (type === 'static') {
      nameMyInput = <p className="form-control-static">{ staticContent }</p>
    }
    if (type === 'children') {
      nameMyInput = this.props.children
    }
    if (horizontalInputStyle) {
      nameMyInput = (
        <div className={horizontalInputStyle}>
          { nameMyInput }
        </div>
      )
    }
    return (
      <div className={`form-group ${hasFeedback ? `has-feedback ${feedback.formGroup}` : ''}`}>
        <label htmlFor={inputId} className={`${horizontalLabelStyle} control-label`}>{label}</label>
        { nameMyInput }
      </div>
    )
  },
  validateSupport() {
    if (!supportedInputTypes[this.props.type]) {
      warn(
        `Unsupported input type[${this.props.type}]! Supported input type config is:`,
        supportedInputTypes
      )
      return false
    }
    return true
  },
})

export default InputGroup
