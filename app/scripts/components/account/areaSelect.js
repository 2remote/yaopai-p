var React = require ('react');
var Reflux = require('reflux');
var Input = require('react-bootstrap').Input;

var AreaActions = require('../../actions/AreaActions');
var AreaStore = require('../../stores/AreaStore');

var AreaSelect = React.createClass({
  mixins : [Reflux.listenTo(AreaStore,'onGetAreaList')],
  getInitialState : function(){
    return {
      provinceList : [],
      cityList : [],
      districtList : []
    }
  },
  componentDidMount : function(){
    AreaActions.getProvince();
  },

  onGetAreaList : function(data){
    if(data.flag == 'province'){
      this.setState({provinceList:data.province});  
    }
    if(data.flag == 'city'){
      this.setState({cityList : data.city})
    }
    if(data.flag == 'district'){
      this.setState({districtList : data.district});
    }
  },
  onProvinceChange : function(){
    this.setState({cityList:[],districtList:[]});
    var v = React.findDOMNode(this.refs.province).value;
    AreaActions.getCity({ParentId : v});
  },
  onCityChange : function(){
    this.setState({districtList:[]});
    var v = React.findDOMNode(this.refs.city).value;
    AreaActions.getDistrict({ParentId : v});
  },
  getValue : function(){
    var p = React.findDOMNode(this.refs.province).value;
    var c = React.findDOMNode(this.refs.city).value;
    var d = React.findDOMNode(this.refs.district).value;
    if(d && d != '0') return d;
    if(c && c != '0') return c;
    if(p && p != '0') return p;
    return null;
  },
  render : function(){
    var province = this.state.provinceList.map(function(item){
      return <option value={item.Id}>{item.Name}</option>
    });
    var city = this.state.cityList.map(function(item){
      return <option value={item.Id}>{item.Name}</option>
    });
    var district = this.state.districtList.map(function(item){
      return <option value={item.Id}>{item.Name}</option>
    });
    var selectStyle = {
      width : '16.6667%!important',
      float: 'left',
      marginLeft: '15px',
    };
    return (
      <div className="form-group">
        <label className="control-label col-xs-2">
          <span>地区：</span>
        </label>
        <select ref="province" 
          type="select" 
          disabled={this.props.disabled} 
          className="form-control" 
          style={selectStyle} 
          onChange={this.onProvinceChange}>
          {province}
        </select>
        <select ref="city" 
          type="select"
          disabled={this.props.disabled} 
          className="form-control" 
          style={selectStyle} 
          onChange={this.onCityChange}>
          {city}
        </select>
        <select ref="district"
          type="select"
          disabled = {this.props.disabled}
          className="form-control"
          style={selectStyle} >
          {district}
        </select>
      </div>
    );
  }
});

module.exports = AreaSelect;