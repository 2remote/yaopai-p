var _ = require('lodash');
var React = require('react');
var Reflux = require('reflux');
var ReactAddons = require('react/addons');
var Button = require('react-bootstrap').Button;

var Checkbox = React.createClass({
  getInitialState : function(){
    return {
      selectedValues: [],
    }
  },

  componentWillMount : function(){
    if(this.props.value && this.props.value.constructor==Array){
      this.setState({selectedValues:this.props.value})
    }
    this.setState({data:this.props.data})
    console.log(this.props)
  },
  setValue: function (event) {
    var key = event.target.getAttribute('data-key');
    var values = this.state.selectedValues;
    var locationOfKey = values.indexOf(key);
    var alreadySelected = locationOfKey >= 0;

    if ( !alreadySelected ){
      values.push(key);
    }else{
      values.splice(locationOfKey, 1);
    }
    this.setState({selectedValues: values});
    this.props.onChange(values);
  },

  render : function(){
    var self = this;
    var style = {
      button: {
        width: '90px',
        height: '32px',
        marginRight: '9px',
        marginBottom: '10px',
      }
    }
    var currentValue = this.state.selectedValues;
    console.log(currentValue)
    var onClickButton = this.setValue;
    // makeButton
    // make Button component from tag data
    function makeButton (row, i) {
      return (<Button key={i}
                bsStyle={(currentValue.indexOf(row.key) >=0) ? 'primary' : 'default'}
                style={style.button}
                onClick={onClickButton}
                data-key={row.key} >
        {row.value}
      </Button>);
    }

    function makeGroup (data) {
      var buttons = data.map(function (value, i) {
        return makeButton(value, i);
      });
      return(
        <div>
          <label className="control-label col-xs-3">{self.props.labelName}</label>
          <div className="col-xs-9">
            <div className="cont-category">
              {buttons}
            </div>
          </div>
        </div>
      );
    }

    var panel = makeGroup(this.state.data);

    return (
      <div className="form-group">
        {panel}
      </div>
    );
  }
});

module.exports = Checkbox;