var React = require('react');
var { History } = require('react-router');
var InfoHeader = require('../infoHeader');

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
      <div>
        <InfoHeader
          infoTitle="摄影师认证"
          infoIconClass="glyphicon glyphicon-camera"
        />
        <div className="row">
          <div className="col-md-4 col-sm-6 col-xs-12">
            <div className="panel panel-default">
              <div className="panel-body text-center">
                <div className="text-center">实名认证：</div>
                <div>状态：{this.props.realName.status}</div>
                <div>原因：{this.props.realName.reason}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-4 col-sm-6 col-xs-12">
            <div className="panel panel-default">
              <div className="panel-body text-center">
                <div className="text-center">摄影师认证：</div>
                <div>状态：{this.props.authPhotographer.status}</div>
                <br />
                {photographerAuthed ?
                  '' : <a className="btn btn-block btn-default" onClick={ () => this.onClickAuthTarget('p') }>我要认证摄影师</a>
                }
              </div>
            </div>
          </div>
          <div className="col-md-4 col-sm-6 col-xs-12">
            <div className="panel panel-default">
              <div className="panel-body text-center">
                <div className="text-center">化妆师认证：</div>
                <div>状态：{this.props.authMakeupArtist.status}</div>
                <br />
                {
                  makeupArtistAuthed ?
                    '' : <a className="btn btn-block btn-default" onClick={ () => this.onClickAuthTarget('a') }>我要认证化妆师</a>
                }
              </div>
            </div>
          </div>
          <div className="col-md-4 col-sm-6 col-xs-12">
            <div className="panel panel-default">
              <div className="panel-body text-center">
                <div className="text-center">模特认证：</div>
                <div>状态：{this.props.authMote.status}</div>
                <br />
                {
                  moteAuthed ?
                    '' : <a className="btn btn-block btn-default" onClick={ () => this.onClickAuthTarget('m') }>我要认证模特</a>
                }
              </div>
            </div>
          </div>
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
    } else {
      this.props.history.pushState(null, targets.second);
    }
    this.props.changeAuthTarget(targets.second);
  },
});

module.exports = AuthSummary;
