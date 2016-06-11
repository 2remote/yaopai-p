var React = require('react');
var { Link, History } = require('react-router');

const LINK_TO_AUTH_BASIC = '/account/auth/basic';
const LINK_TO_AUTH_REALNAME = '/account/auth/real';
const LINK_TO_AUTH_PHOTOGRAPHER = '/account/auth/p';
const LINK_TO_AUTH_MAKEUPARTIST = '/account/auth/a';
const LINK_TO_AUTH_MOTE = '/account/auth/m';
const LINK_TO_AUTH_SUMMARY = '/account/auth/';

const convertLinkToVal = function(basic, real, type) {
  let secondTarget = type === 'p' ? LINK_TO_AUTH_PHOTOGRAPHER :
    type === 'a' ? LINK_TO_AUTH_MAKEUPARTIST :
    type === 'm' ? LINK_TO_AUTH_MOTE :
    LINK_TO_AUTH_SUMMARY;
  let firstTarget  = !basic ? LINK_TO_AUTH_BASIC :
    !real ? LINK_TO_AUTH_REALNAME : '';
  return {
    first: firstTarget,
    second: secondTarget,
  };
};

var AuthSummary = React.createClass({
  mixins: [History],
  render: function() {
    const {
      photographerAuthed,
      makeupArtistAuthed,
      moteAuthed,
     } = this.props;
    return (
      <div className="row">
        <h3>Summary</h3>
        <div className="col-md-4">实名认证：
          <div>状态：{this.props.realName.status}</div>
        </div>
        <div className="col-md-4">摄影师认证：
          <div>状态：{this.props.authPhotographer.status}</div>
          {photographerAuthed ?
            '' : <a onClick={ () => this.onClickAuthTarget('p') }>我要认证摄影师</a>
          }
        </div>
        <div className="col-md-4">化妆师认证：
          <div>状态：{this.props.authMakeupArtist.status}</div>
          {
            makeupArtistAuthed ?
              '' : <a onClick={ () => this.onClickAuthTarget('a') }>我要认证化妆师</a>
          }
        </div>
        <div className="col-md-4">模特认证：
          <div>状态：{this.props.authMote.status}</div>
          {
            moteAuthed ?
              '' : <a onClick={ () => this.onClickAuthTarget('m') }>我要认证模特</a>
          }
        </div>
      </div>
    );
  },
  onClickAuthTarget: function(magic) {
    const {
      userComplete,
      realNameComplete,
    } = this.props;
    targets = convertLinkToVal(userComplete, realNameComplete, magic);
    if(targets.first) {
      this.props.history.pushState(null, targets.first);
    }
    this.props.changeAuthTarget(targets.second);
    this.props.history.pushState(null, targets.second);
  },
});

module.exports = AuthSummary;
