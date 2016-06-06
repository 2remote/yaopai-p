var React = require('react');

var AuthPhotographer = React.createClass({
  render: function() {
    return (
      <div>
        photographer<br />
        {this.props.children}
      </div>
    );
  },
});

module.exports = AuthPhotographer;