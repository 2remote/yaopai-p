var React = require('react');

var IndexCover = React.createClass({
    render : function(){
      return (
      <div className="centerContent">
          {this.props.children}
      </div>
    );
  }
});

module.exports = IndexCover;