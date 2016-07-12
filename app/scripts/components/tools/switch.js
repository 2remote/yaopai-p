var React = require('react');

var Switch = React.createClass({
  getDefaultProps : function(){
    return {
      label :'',
      textOff : '',
      textOn : '',
    }
  },
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
      border: '1px solid #e6c288',
      display: 'inline-block',
      textAlign: 'center',
      cursor: 'pointer',
    };
    var noSelected = {
      background : 'gray',
      width: '78px',
      lineHeight: '40px',
      border: '1px solid #e6c288',
      color: '#fff',
      display: 'inline-block',
      textAlign: 'center',
      cursor: 'pointer',
    };
    var yesSelected = {
      width: '78px',
      lineHeight: '40px',
      background : '#e6c288',
      border: '1px solid #e6c288',
      color: '#fff',
      display: 'inline-block',
      textAlign: 'center',
      cursor: 'pointer',
    };
    return (
      <div className= "form-group">
        <label className="control-label col-xs-3">{this.props.label}：</label>
        <div className="col-xs-5">
          <span onClick={this.props.disabled?null:this.onNoClick} style={this.props.checked?normalStyle:noSelected}>{this.props.textOff}</span>
          <span onClick={this.props.disabled?null:this.onYesClick} style={this.props.checked?yesSelected:normalStyle}>{this.props.textOn}</span>
        </div>
      </div>
    );
  }
});
module.exports = Switch;