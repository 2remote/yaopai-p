var React = require('react');
var { History } = require('react-router');

var AuthRealName = React.createClass({
  mixins: [History],
  componentWillMount: function() {
    if(this.props.realNameComplete) {
      this.props.history.pushState(null, this.props.authTarget);
    }
  },
  render: function() {
    return (
      <div>
        real name<br />
        <a onClick={ this.onSubmitRealName }>继续</a>
      </div>
    );
  },
  onSubmitRealName: function() {
    // really, submit real name info
    this.props.history.pushState(null, this.props.authTarget);
  },
});

module.exports = AuthRealName;