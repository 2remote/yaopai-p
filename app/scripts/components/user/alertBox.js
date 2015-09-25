var React = require('react');
var Alert = require('react-bootstrap').Alert;

const AlertBox = React.createClass({
  getInitialState : function() {
    return {
      alertVisible: true
    };
  },

  render : function() {
    if (this.props.alertMessage!='' ) {
      return (
        <div className="col-sm-offset-2 col-sm-6">
          <Alert bsStyle='danger' onDismiss={this.handleAlertDismiss}>
            {this.props.alertMessage}
          </Alert>
         </div>
      );
    }

    return (
      <div></div>
    );
  },

  handleAlertDismiss : function() {
    this.props.alertMessage = '';
    this.setState({alertVisible:false});
  },
});

module.exports = AlertBox;