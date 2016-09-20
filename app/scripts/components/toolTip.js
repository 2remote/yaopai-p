import React from 'react'

const ToolTip = React.createClass({
  getInitialState() {
    return {
      title: '',
      top: -200,
    }
  },

  toShow(title) {
    const self = this
    self.setState({ title, top: 0 })
    setTimeout(() => self.setState({ top: -200 }), 5000)
  },

  render() {
    const toolTipStyle = {
      width: '100%',
      position: 'fixed',
      background: '#ccac7b',
      lineHeight: '100px',
      height: 100,
      zIndex: 9999,
      textAlign: 'center',
      color: '#000',
      transition: 'top 2s',
      left: 0,
      top: this.state.top,
    }
    return (
      <div className="tool-tip" style={toolTipStyle}>{this.state.title}</div>
    )
  },
})

module.exports = ToolTip
