var React = require('react');

const AuthResult = React.createClass({
  render: function() {
    return (
      <div>
        认证已提交<br />
        请耐心等待 1-2 上工作日审核
      </div>
    );
  },
});

module.exports = AuthResult;
