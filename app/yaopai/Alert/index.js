import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'

const alert = {}

const Alert = React.createClass({
  propTypes: {
    content: PropTypes.node,
  },

  render() {
    const { content } = this.props
    return (
      <div>
        alert
        {content}
      </div>
    )
  },
})

export default alert

// ReactDOM.render(routes, document.getElementById('content'))
