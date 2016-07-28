var React = require('react');
var Radium = require('radium');

var ToolTip = React.createClass({
  getDefaultProps: function () {
    return {
      changeStyle: {
        width: '100%',
        position: 'fixed',
        background: '#ccac7b',
        lineHeight: '100px',
        height: '100px',
        zIndex: '999',
        textAlign: 'center',
        color: '#000',
        transition: 'top 2s',
      },
    }
  },
  getInitialState: function () {
    return {
      title : '',
      setTop: {
        top: '-200px',
      }
    }
  },
  toShow: function (title) {
    this.setState({title: title, setTop: {top: '0px'}});
    setTimeout(function () {
      this.setState({setTop: {top: '-200px'}})
    }.bind(this), 5000);
  },
  render: function () {
    return (
      <div className="tool-tip" style={[this.props.changeStyle, this.state.setTop]}>{this.state.title}</div>
    )
  }
});
module.exports = Radium(ToolTip);