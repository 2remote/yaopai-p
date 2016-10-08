import React, { PropTypes } from 'react'

const getAlertTypeClassName = (type) => {
  const alertTypes = {
    default: 'alert-default',
    warnning: 'alert-warnning',
    error: 'alert-error',
    success: 'alert-success',
  }

  return alertTypes[type] ? alertTypes[type] : alertTypes.default
}

const getAlertAnimationClassName = (animation) => {
  const alertAnimation = {
    slide: 'slide',
    fade: 'alert-fade',
  }

  return alertAnimation[animation] || ''
}

class AlertItem extends React.Component {
  componentWillUnmount() {
    console.log('AlertItem will unmount:', this.props.id)
  }

  render() {
    const { id, content, title, type, animation } = this.props
    return (
      <div key={id} className={`alert-message ${getAlertTypeClassName(type)} ${getAlertAnimationClassName(animation)}`}>
        <div>{`${id} ${title}`}</div>
        <div>{content}</div>
      </div>
    )
  }
}

AlertItem.propTypes = {
  id: PropTypes.number.isRequired,
  content: PropTypes.node,
  title: PropTypes.node,
  animation: PropTypes.string,
  type: PropTypes.string,
}

export default AlertItem
