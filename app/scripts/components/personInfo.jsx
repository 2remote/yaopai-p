var Radium = require('radium');
var React = require('react');
var ImageInput = require('./account/imageInput');
var Input = require('react-bootstrap').Input;
var Button = require('react-bootstrap').Button;

var InfoHeader = React.createClass({
  render: function () {
    var style = {
      headerInfo: {
        fontSize: '22px',
        color: '#777777',
        borderBottomWidth: '1px',
        borderBottomStyle: 'solid',
        borderBottomColor: '#e8e8e8',
      },
      title: {
        paddingLeft: '20px',
      }
    };
    return (
      <div style={style.headerInfo} className="header-info">
        <span className="glyphicon glyphicon-user" aria-hidden="true"></span>
        <span style={style.title} className="title">个人信息</span>
      </div>
    );
  }
});
var UserImage = React.createClass({
  componentDidMount : function(){

  },
  render: function () {
    var style = {
      label: {
        lineHeight: '150px',
        verticalAlign: 'top',
      }
    }
    return (
      <div className="form-group">
        <label className="control-label col-xs-2" style={style.label}>头像</label>
        <div id="uploadAvatorC" className="col-xs-4">
            <ImageInput uid="uploadAvator" type="user" defaultImage="img/default_user_img.png" />
          </div>
      </div>
    );
  }
});
var UserAlias = React.createClass({
  render: function () {
    return (
      <Input type="text" label="昵称" labelClassName="col-xs-2" wrapperClassName="col-xs-4"/>
    );
  }
});
var Select = React.createClass({
  handleGender: function () {
    this.props.onSelect(this.props.number);
  },
  render: function () {
    var style = {
      commonButton: {
        paddingLeft: '30px',
        paddingRight: '30px',
        marginRight: '20px',
      },
    };
    return (
      <Button bsStyle={this.props.active} style={style.commonButton} onClick={this.handleGender}>{this.props.gender}</Button>
    );
  }
});
var UserGender = React.createClass({
  getDefaultProps: function () {
    return {
      items: [
        {num: 0, name: '男'},
        {num: 1, name: '女'}
      ],
    }
  },
  getInitialState: function () {
    return {
      genderNum: 0,
    }
  },
  setActive: function (num) {
    this.setState({genderNum: num});
  },
  getValue: function () {
    return this.state.genderNum;
  },
  render: function () {
    return (
      <div className="form-group">
        <label className="control-label col-xs-2">性别</label>
        <div className="col-xs-4">
          {
            this.props.items.map(function (item) {
              return <Select active={this.state.genderNum == item.num? 'primary': 'default'} onSelect={this.setActive} number={item.num} gender={item.name} key={item.num}/>
            }.bind(this))
          }
        </div>
      </div>
    );
  }
});
/*地区插件*/
var District = React.createClass({
  render: function () {
    return (
      <div className="form-group">
        <label className="control-label col-xs-2">地区</label>
        <div className="col-xs-4">
          <input type="text" className="form-control"/>
        </div>
      </div>
    );
  },
});
var PersonInfo = React.createClass({
  handlePreserve: function () {
    var gender = this.refs.gender.getValue();
    console.log(gender);
  },
  render: function () {
    var style = {
      outer: {
        backgroundColor: '#fff',
        paddingTop: '40px',
        paddingLeft: '60px',
        paddingBottom: '70px',
      },
      save: {
        textAlign: 'center',
      }
    };
    return (
      <div style={[style.outer]}>
        <form className='form-horizontal'>
          <InfoHeader />
          <UserImage />
          <UserAlias />
          <UserGender ref="gender"/>
          <District />
          <Button className="col-xs-offset-3" bsStyle="primary" onClick={this.handlePreserve}>保存</Button>
        </form>
      </div>
    );
  }
});

module.exports = Radium(PersonInfo);