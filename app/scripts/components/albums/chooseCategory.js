var React = require('react');
var Reflux = require('reflux');
var Button = require('react-bootstrap').Button;
var AlbumsActions = require('../../actions/AlbumsActions');
var AlbumsStore = require('../../stores/AlbumsStore');

var ChooseCategory = React.createClass({
  getDefaltProps: function () {
    return {
      value: 0,
      categories: [],
      onChange: function (data) {
      },
    }
  },
  setCategory: function (event) {
    console.log("event.target.getAttribute('data-category')=" + event.target.getAttribute('data-category'))
    this.props.onChange(event.target.getAttribute('data-category'));
  },
  render: function () {
    var style = {
      button: {
        width: '90px',
        height: '32px',
        marginRight: '9px',
        marginBottom: '10px',
      }
    }

    //目前没有做排序和是否显示
    var buttons = this.props.categories.map(function (item, i) {
      return (<Button key={i} bsStyle={this.props.value==item.Id?'primary':'default'} style={style.button}
                      onClick={this.setCategory} data-category={item.Id}>{item.Name}</Button>);
    }.bind(this));
    return (
      <div className="form-group">
        <label className="control-label col-xs-2">类别：</label>

        <div className="col-xs-10">
          <div className="cont-category">
            {buttons}
          </div>
        </div>
      </div>
    );
  }
});

module.exports = ChooseCategory;