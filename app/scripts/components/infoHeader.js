var React = require('react');

var InfoHeader = React.createClass({
  getDefaultProps: function () {
    return {
      infoTitle: '个人信息',
      infoIconClass: 'glyphicon glyphicon-user'
    }
  },
  render: function () {
    var style = {
      headerInfo: {
        fontSize: '22px',
        color: '#777777',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: '#e8e8e8',
      },
      title: {
        paddingLeft: '20px',
      }
    };
    return (
      <div style={style.headerInfo} className="header-info">
        <span className={this.props.infoIconClass} aria-hidden="true"></span>
        <span style={style.title} className="title">{this.props.infoTitle}</span>
      </div>
    );
  }
});
module.exports = InfoHeader;