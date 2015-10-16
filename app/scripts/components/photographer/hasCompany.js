var React = require('react');

var HasCompany = React.createClass({
  onNoClick : function(event){
    this.props.onChange(false);
  },
  onYesClick : function(event){
    this.props.onChange(true);
  },
  getValue : function(){
    return this.props.checked;
  },
  render : function (){
    var normalStyle = {
      width: '78px',
      lineHeight: '40px',
      border: '1px solid #e0e0e0',
      display: 'inline-block',
      textAlign: 'center',
      cursor: 'pointer',
    };
    var noSelected = {
      background : 'gray',
      width: '78px',
      lineHeight: '40px',
      border: '1px solid #e0e0e0',
      color: '#fff',
      display: 'inline-block',
      textAlign: 'center',
      cursor: 'pointer',
    };
    var yesSelected = {
      width: '78px',
      lineHeight: '40px',
      background : '#337ab7',
      border: '1px solid #e0e0e0',
      color: '#fff',
      display: 'inline-block',
      textAlign: 'center',
      cursor: 'pointer',
    };
    return (
      <div className= "form-group">
        <label className="control-label col-xs-2">是否有工作室：</label>
        <div className="col-xs-4">
          <span onClick={this.props.disabled?null:this.onNoClick} style={this.props.checked?normalStyle:noSelected}>NO</span>
        <span onClick={this.props.disabled?null:this.onYesClick} style={this.props.checked?yesSelected:normalStyle}>YES</span>
        </div>
      </div>
    );
  }
});
module.exports = HasCompany;