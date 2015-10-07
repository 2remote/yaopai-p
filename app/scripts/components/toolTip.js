var React = require('react');
var Radium = require('radium');

var ToolTip = React.createClass({
  getDefaultProps: function () {
    return {
      title: 'toolTip',
    }
  },
  getInitialState: function () {
    return {
      title : '',
      changeStyle: {
        width: '386px',
        position: 'fixed',
        left: '50%',
        marginLeft: '-193px',
        background: 'rgba(154, 35, 35, 0.7)',
        lineHeight: '100px',
        height: '100px',
        zIndex: '9',
        textAlign: 'center',
        color: '#fff',
        transition: 'top 1s',
      },
      setTop: {
        top: '-200px',
      }
    }
  },
  toShow: function (title) {
    this.setState({title:title,setTop: {top: '10px'}});
    setTimeout(function () {
      this.setState({setTop: {top: '-200px'}})
    }.bind(this), 5000);
  },
  render: function () {
    return (
      <div className="tool-tip" style={[this.state.changeStyle, this.state.setTop]}>{this.state.title}</div>
    )
  }
});
module.exports = Radium(ToolTip);