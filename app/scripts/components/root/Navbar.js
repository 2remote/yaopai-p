/**
 * 使用Bootstrap的navbar-fixed-top做的深色导航
 * 链接的active状态与react-router的history对接
 *
 * @since 2016-06-14
 * TODO: 上传作品提示用户先认证的逻辑
 * TODO: 这版用的Bootstrap改过了？为毛明明3.3.5，却有 .nav > li 的 float: left？bootcdn上搜到的可没有= =
**/
var React = require('react');
var { Link, History } = require('react-router');
var { ROUTE_ACCOUNT_INFO, ROUTE_ALBUM_UPLOAD, ROUTE_AUTH } = require('../../routeConfig');

const Navbar = React.createClass({
  mixins: [History],
  render: function() {
    console.log('history', this.history);
    return (
      <nav className="navbar navbar-inverse navbar-fixed-top">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed"
              data-toggle="collapse" data-target="#navbar" aria-expanded="false"
            >
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <span className="navbar-brand">
              <img style={{ height: 21 }} src="img/logo.png" alt="YAOPAI" />
            </span>
          </div>
          <div className="collapse navbar-collapse" id="navbar">
            <ul className="nav navbar-nav">
              <li className={this.history.isActive(ROUTE_AUTH) ? 'active' : ''}>
                <Link to={ ROUTE_AUTH }>我要认证</Link>
              </li>
              <li className={this.history.isActive(ROUTE_ALBUM_UPLOAD) ? 'active' : ''}>
                <Link to={ ROUTE_ALBUM_UPLOAD }>上传作品</Link>
              </li>
              <li className={this.history.isActive(ROUTE_ACCOUNT_INFO) ? 'active' : ''}>
                <Link to={ ROUTE_ACCOUNT_INFO }>完善资料</Link>
              </li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li><a>登出</a></li>
            </ul>
          </div>
        </div>
      </nav>
    );
  },
});

module.exports = Navbar;
