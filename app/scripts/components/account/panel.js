var React = require('react');

var Panel = React.createClass({
  getInitialState : function(){
    return {
      panelStyle : {opacity : '0.01',transition : 'opacity 0.5s ease-in'}
    }
  },
  componentDidMount : function(){
    var activeStyle = {
      opacity : '1',
      transition : 'opacity 0.5s ease-in'
    };
    this.setState({panelStyle : activeStyle});
  },
  render : function(){
    return (
      <div className="panel panel-default" style={this.state.panelStyle}>
        {this.props.children}
      </div>
    );
  }
});

module.exports = Panel;