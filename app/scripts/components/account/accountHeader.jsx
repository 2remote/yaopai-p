var React = require('react');
var React = require('react');
var Router = require('react-router');
var Link  = Router.Link;

var AccountHeader = React.createClass({
  render : function(){
    return (
      <div className="row">
        <div className="col-sm-8">
          <span><h3>{this.props.titleName}</h3></span>
        </div>
        <div className="col-sm-4">
          <span>{this.props.subTitleName}</span>
        </div>
        <div className="line">
        </div>
      </div>
      )
  }
});


module.exports = AccountHeader;