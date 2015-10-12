var React = require('react');
var TagsInput = require('react-tagsinput');
/*
  选择标签组件
*/
const TagsList = {
  'theme' : [
    {
      'id' : '1001',
      'title' : '风光'
    },
    {
      'id' : '1002',
      'title' : '人像'
    }
  ],
  'style' : [
    {
      'id' : '2001',
      'title' : '色彩'
    },
    {
      'id' : '2002',
      'title' : '小清新'
    }
  ],
  'camera' : [
    {
      'id' : '3001',
      'title' : '佳能'
    },
    {
      'id' : '3002',
      'title' : '尼康'
    }
  ],
  'region' : [
    {
      'id' : '4001',
      'title' : '郑州'
    },
    {
      'id' : '4002',
      'title' : '北京'
    }
  ]
};


var ConstTags = React.createClass({
  getDefaultProps : function(){
    return {
      cat : '',
      handleSelectTag : function(event){
        //console.log(tag);
      }
    }
  },
  render : function(){
    var style = {
      tags： {
        color: '#4f5a67',
      }
    };
    var name = "";
    var tagsItems =[];
    switch(this.props.cat){
      case 'theme' : tagsItems = TagsList.theme; name="主题：";
      break;
      case 'style' : tagsItems = TagsList.style; name="风格：";
      break;
      case 'camera' : tagsItems = TagsList.camera; name="器材：";
      break;
      case 'region' : tagsItems = TagsList.region; name="地区：";
      break;
    }

    var result =  tagsItems.map(function(item,i){
      return (
        <span onClick={this.props.handleSelectTag}>{item.title}</span>
      );
    }.bind(this));
    return (
      <div style={style.tags}>
      <p>{name}</p>
      <p>{result}</p>
      </div>)
  }
});


var ChooseTag = React.createClass({
  displayName: "TagsComponent",
  //mixins: [ReactAddons.addons.LinkedStateMixin],

  getInitialState: function () {
    return { tags: [] };
  },
  addTag : function (event){
    this.refs.tagsInput.addTag(event.target.innerHTML);
  },
  render : function(){
    return(
      <div className="form-group">
        <label className="control-label col-xs-2">标签：</label>
        <div className="col-xs-10">
          <div className="choose-tag">
            <TagsInput ref='tagsInput' placeholder="输入标签回车"/>
            <div className="const-tags">
              <ConstTags cat="theme" handleSelectTag={this.addTag}/>
              <ConstTags cat="style" handleSelectTag={this.addTag}/>
              <ConstTags cat="camera" handleSelectTag={this.addTag}/>
              <ConstTags cat="region" handleSelectTag={this.addTag}/>
            </div>
          </div>
        </div>
      </div>
      )
  }
});

module.exports = ChooseTag;