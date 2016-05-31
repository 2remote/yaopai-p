var React = require('react');
var MultiImageSelect = require('./multiImageSelect');
var ToolTip = require('../toolTip');

var AuthSubmitAudit = React.createClass({
  getInitialState: function(){
    return {
      authState : '0',
      disabled : false,
      pAuthData : {}
    }
  },
  updateProducts : function(result){
    var datas = [];
    if(this.state.pAuthData.Works)
      datas = this.state.pAuthData.Works.split(',');
    datas.push(result);
    var pAuthData = this.state.pAuthData;
    pAuthData.Works = datas.toString();
    this.setState({pAuthData:pAuthData});
  },
  showMessage : function(message) {
    this.refs.toolTip.toShow(message);
  },
  removeWorks : function(index){
    var data = this.state.pAuthData;
    var works = data.Works;
    if(works && works.length > 0){
      works = works.split(',');
      if(index < works.length){
        works.splice(index,1);
        data.Works = works.toString();
        this.setState({pAuthData : data});
      }
    }
  },
  render: function() {
    return (
      <div>
        <MultiImageSelect ref = "works"
          uid = "worksSelect"
          labelName = "个人作品："
          width = "100"
          height = "100"
          images = { this.state.pAuthData.Works }
          disabled = { this.state.disabled }
          maxCount = { 15 }
          placeholder = "温馨提示：请上传8-15张多种风格的作品"
          updateImages = { this.updateProducts }
          showMessage = { this.showMessage }
          remove = { this.removeWorks }
        />
        <button className="btn btn-default">就这么结束吧</button>
        <ToolTip ref="toolTip" title=""/>
      </div>
    );
  },
});

module.exports = AuthSubmitAudit;
