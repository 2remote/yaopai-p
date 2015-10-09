var React = require('react');

var InfoHeader = React.createClass({
  getDefaultProps: function () {
    return {
      infoTitle: '个人信息',
      infoIconClass: 'glyphicon glyphicon-user',
      rightInfo: '',
    }
  },
  render: function () {
    var style = {
      headerInfo: {
        fontSize: '22px',
        color: '#777777',
        borderBottom: '1px solid #e8e8e8',
        marginBottom: '40px',
      },
      title: {
        paddingLeft: '20px',
      },
      rightInfo: {
        textAlign: 'right',
      }
    };
    return (
      <div className="row" style={style.headerInfo}>
        <div className="col-xs-4">
          <span className={this.props.infoIconClass} aria-hidden="true"></span>
          <span style={style.title} className="title">{this.props.infoTitle}</span>
        </div>
        <div className="col-xs-8">
          <p style={style.rightInfo}>{this.props.rightInfo}</p>
        </div>
      </div>
    );
  }
});
module.exports = InfoHeader;