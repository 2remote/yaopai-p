import React from 'react';

const NoData = React.createClass({
  getDefaultProps: function() {
    return {
      message: '',
    };
  },
  render: function() {
    var layoutStyle = {
      height : '100%',
      width: 250,
      margin: '100px 0',
      textAlign:'center',
      position:'relative',
    };
    return (
      <div style={layoutStyle}>
        {this.props.message}
      </div>
    );
  },
});

export default NoData;
// module.exports = NoData;
