var React = require('react');
var Reflux = require('reflux');
var History = require('react-router').History;
var MultiImageSelect = require('./multiImageSelect');
var ToolTip = require('../toolTip');
var PAuthActions = require('../../actions/PAuthActions');
var PAuthStore = require('../../stores/PAuthStore');

var AuthSubmitAudit = React.createClass({
  mixins: [
    Reflux.listenTo(PAuthStore, 'onPAuthStoreChange'),
    History
  ],
  onPAuthStoreChange: function(msg) {
    if(msg.flag === 'submitAudit' && msg.submitAuditSuccess) {
      this.history.replaceState(null, '/');
    } else {
      this.showMessage(msg.hintMessage);
    }
  },
  getInitialState: function() {
    return {
      authState: '0',
      disabled: false,
      pAuthData: {},
    }
  },
  updateProducts: function(result) {
    var datas = [];
    if(this.state.pAuthData.Works) {
      datas = this.state.pAuthData.Works.split(',');
    }
    datas.push(result);
    var pAuthData = this.state.pAuthData;
    pAuthData.Works = datas.toString();
    this.setState({ pAuthData: pAuthData });
  },
  showMessage: function(message) {
    this.refs.toolTip.toShow(message);
  },
  removeWorks: function(index) {
    var data = this.state.pAuthData;
    var works = data.Works;
    if(works && works.length > 0) {
      works = works.split(',');
      if(index < works.length) {
        works.splice(index,1);
        data.Works = works.toString();
        this.setState({ pAuthData: data });
      }
    }
  },
  onSubmit: function(e) {
    PAuthActions.submitAudit({
      Works: this.state.pAuthData.Works,
    });
    e.preventDefault();
  },
  render: function() {
    return (
      <form className="form-horizontal" onSubmit={ this.onSubmit }>
        <MultiImageSelect ref="works"
          uid="worksSelect"
          labelName="个人作品："
          width="100"
          height="100"
          images={ this.state.pAuthData.Works }
          disabled={ this.state.disabled }
          maxCount={ 15 }
          placeholder="温馨提示：请上传8-15张多种风格的作品"
          updateImages={ this.updateProducts }
          showMessage={ this.showMessage }
          remove={ this.removeWorks }
        />
        <div className="form-group">
          <div className="col-xs-offset-3 col-xs-9">
            <button type="submit" className="btn btn-primary">下一步</button>
          </div>
        </div>
        <ToolTip ref="toolTip" title=""/>
      </form>
    );
  },
});

module.exports = AuthSubmitAudit;
