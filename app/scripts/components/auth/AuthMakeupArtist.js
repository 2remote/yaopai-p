var React = require('react');

var AuthMakeupArtist = React.createClass({
  render: function() {
    return (
      <div>
        Artist<br />
        {this.props.children}
      </div>
    );
  },
});

module.exports = AuthMakeupArtist;