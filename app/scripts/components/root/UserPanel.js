var React = require('react');
var Reflux = require('reflux');
var QRCode = require('qrcode.react');

var UserAccountStore = require('../../stores/UserAccountStore');

const UserPanel = React.createClass({
  mixins: [Reflux.connect(UserAccountStore, 'user')],
  render: function() {
    console.log('[UserPanel]', this.state.user);
    let { user } = this.state;
    return (
      <div className="panel panel-default">
        <div className="panel-body text-center">
          <div className="thumbnail" style={{ marginBottom: 100 }}>
            <img src={ user.basic.avatar } className="img-circle" />
            <div className="caption">
              <h4>{ user.basic.nickname }</h4>
              <p>{ user.basic.signature }</p>
              <button className="btn btn-default">切换用户</button>
            </div>
          </div>
          <div style={{ marginBottom: 150 }}>
            <button className="btn btn-lg btn-block btn-info">我要认证</button>
            <button className="btn btn-lg btn-block btn-default">上传作品</button>
            <button className="btn btn-lg btn-block btn-default">完善资料</button>
          </div>
          <div className="row">
            <div className="col-lg-6">
              <QRCode value="ssss" size={ 128 } />
              <div>个人主页</div>
            </div>
            <div className="col-lg-6">
              <img src="img/qrcode_dingyue.jpg" width="128" />
              <div>微信订阅号</div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

module.exports = UserPanel;
