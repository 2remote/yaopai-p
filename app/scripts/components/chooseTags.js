var _ = require('lodash');
var React = require('react');
var Reflux = require('reflux');
var ReactAddons = require('react/addons');
var validator = require('validator');
var Button = require('react-bootstrap').Button;
var InfoHeader= require('./infoHeader');
var TextInput = require('./account/textInput');
var ChooseImage = require('./account/chooseImage');
var Panel = require('react-bootstrap').Panel;

var assert = require('assert');
var ToolTip = require('./toolTip');
var AlbumsStore = require('../stores/AlbumsStore');
var AlbumsActions = require('../actions/AlbumsActions');
var WorkStore = require('../stores/WorkStore');
var UserActions = require("../actions/UserActions");
var UserStore = require("../stores/UserStore");

/*
 选择类别组件
 */
var ChooseTags = React.createClass({
  mixins : [Reflux.listenTo(AlbumsStore,'onGetCategories')],

  //render 方法就应该放第一个!!
  render : function(){
    var style = {
      button: {
        width: '90px',
        height: '32px',
        marginRight: '9px',
        marginBottom: '10px',
      }
    }
    var currentTags = this.state.selectedTags;
    var onClickButton = this.setTag;
    // makeButton
    //
    // make Button component from tag data
    // tag - obj, {Id: 4, Name: "人像", Display: true}
    function makeButton (tag, i) {
      return (
        <Button key={i}
          bsStyle={(currentTags.indexOf(tag.Id) >=0) ? 'primary' : 'default'}
          style={style.button}
          onClick={onClickButton}
          data-category={tag.Id} >
        {tag.Name}
        </Button>
      );
    }

    function makeTagRow (tagRow,rowIndex) {
      var buttons = tagRow.Tags
        .sort(function(a,b){
          if(a.Sorting>b.Sorting){
            return 1;
          }else if(a.Sorting==b.Sorting){
            if(a.Id>b.Id)
              return 1;
            else
              return -1;
          }else{
            return -1;
          }
        })
        .map(function (tag, i) {
          return makeButton(tag, i);
        });
      return(
        <div key={rowIndex}>
          <label className="control-label col-xs-3">{tagRow.Name}</label>
          <div className="col-xs-9">
            <div className="cont-category">
              {buttons}
            </div>
          </div>
          <ToolTip ref="toolTip" title=""/>
        </div>
      );
    }

    function makeTagList (tagList) {
      var existTagList = (typeof tagList != 'undefined');
      var tags = (<div className="no tag list"></div>);
      if(existTagList){
        assert(typeof tagList != 'undefined', 'tagList must exist');
        tags = tagList.map(function (list,i) {
          return makeTagRow(list,i);
        })
      }
      return tags;
    }

    //目前没有做排序和是否显示
    var tagList = makeTagList(this.state.tags);

    return (
      <div className="form-group">
        {tagList}
        <ToolTip ref="toolTip" title=""/>
      </div>
    );
  },

  getInitialState : function(){
    return {
      categories : [],
      selectedTags: [],
    }
  },

  componentWillMount : function(){
    AlbumsActions.getTagList();
    if(this.props.value && this.props.value.constructor==Array){
      this.setState({selectedTags:this.props.value.map(function (item) {
        return item.Id
      })})
    }
  },

  onGetCategories : function(data){
    console.log('updated data', data);
    if(data.hintMessage){
      console.log(data.hintMessage);
    }else{
      console.log(data.tags)
      this.setState({tags : data.tags});
    }
  },

  setTag: function (event) {
    var self = this;
    var tagId = event.target.getAttribute('data-category');
    tagId = parseInt(tagId);
    var tags = this.state.selectedTags;
    var locationOfTagId = tags.indexOf(tagId);
    var alreadySelected = locationOfTagId >= 0;

    if ( !alreadySelected ){
      //每个分类下最多设置三个标签
      var allTags = this.state.tags;
      var isBreak = false;
      allTags.forEach(function (item) {
        var ids = _.map(item.Tags, 'Id');
        if(ids.indexOf(tagId) > -1){//判断所点击的标签是否是这个分类内的
          var tmp = _.intersection(ids, tags);//重复的内容
          //类别标签为必选标签且只能选一个；其他分类下最多可设置三个标签
          if(item.Name=='类别'){
            if(tmp.length >= 1){
              isBreak = true;
              alert('最多仅限选1个标签,再次点击已选标签即可取消!')
            }
          }else{
            if(tmp.length >= 3){
              isBreak = true;
              alert('最多仅限选3个标签,再次点击已选标签即可取消!')
            }
          }
        }
      })
      if(!isBreak){
        tags.push(tagId);
      }
    }else{
      tags.splice(locationOfTagId, 1);
    }
    this.setState({selectedTags: tags});
    this.props.onChange(tags);
  }

});

module.exports = ChooseTags;
