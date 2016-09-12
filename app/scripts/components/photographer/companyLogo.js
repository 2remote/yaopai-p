
import React from 'react'
import logoUpImg from 'image/logo_up.png'
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
        <label className="control-label col-xs-3" style={style.label}>工作室LOGO：</label>
        <div className="col-xs-6">
          <ImageInput
            width="200"
            height="120"
            colWidth=""
            uid="companyLogo"
            ref="companyLogo"
            multi_selection={false}
            disabled = {this.props.disabled}
            defaultImage ={this.props.value?this.props.value: logoUpImg }
            onUpload = {this.props.updateValue}
            onError={this.props.showMessage}
            type="user"/>
        </div>
      </div>
    );
  }
});

module.exports = CompanyLogo;
