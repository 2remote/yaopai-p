var React = require('react');

const AuthResult = React.createClass({
  render: function() {
    return (
      <div className="text-center">
        <i className="icon renzheng" style={{
            color: '#E6C288',
            fontSize: 200,
          }}></i>
          <br />
        <strong>认证已提交</strong>
        <br />
        请耐心等待 1-2 上工作日审核
      </div>
    );
  },
});

module.exports = AuthResult;
