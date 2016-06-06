var React = require('react');

var AuthMote= React.createClass({
  render: function() {
    return (
      <div>
        Model<br />
        {this.props.children}
      </div>
    );
  },
});

module.exports = AuthMote;