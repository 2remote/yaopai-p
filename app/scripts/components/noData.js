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
      marginTop: 100,
      textAlign:'center',
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
