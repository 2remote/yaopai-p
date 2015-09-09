var React = require('react');
var Alert = require('react-bootstrap').Alert;

const AlertBox = React.createClass({
  getInitialState() {
    return {
      alertVisible: true
    };
  },

  render() {
    if (this.props.alertMessage!='') {
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

  handleAlertDismiss() {
    this.props.alertMessage = '';
    this.setState({alertMessage:false});
  },
});

module.exports = AlertBox;