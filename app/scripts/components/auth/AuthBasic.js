var React = require('react');
var { History } = require('react-router');

var AuthBasic = React.createClass({
  mixins: [History],
  componentWillMount: function() {
    if(this.props.userComplete) {
      this.props.history.pushState(null, '/account/auth/real');
    }
  },
  render: function() {
    return (
      <div>
        Basic<br />
        <a onClick={ this.onSubmitBasic }>走，实名认证去！</a>
      </div>
    );
  },
  onSubmitBasic: function() {
    this.props.history.pushState(null, '/account/auth/real');
  },
});

module.exports = AuthBasic;