
var React = require('react');
var ImageInput = require('../account/imageInput');

var CompanyLogo = React.createClass({
  getDefaultProps : function(){
    return {
      value : '',
      updateValue : function(data){},
    }
  },
  getValue : function () {
    return this.refs.companyLogo.getValue();
  },
  render : function () {
    var style = {
      label: {
        lineHeight: '120px',
      }
    };
    return (
      <div className="form-group">
        <label className="control-label col-xs-2" style={style.label}>工作室LOGO：</label>
        <div className="col-xs-6">
          <ImageInput
            width="200"
            height="120"
            colWidth=""
            uid="companyLogo"
            ref="companyLogo"
            disabled = {this.props.disabled}
            defaultImage ={this.props.value?this.props.value:"img/logo_up.png" }
            onUpload = {this.props.updateValue}
            type="user"/>
        </div>
      </div>
    );
  }
});

module.exports = CompanyLogo;