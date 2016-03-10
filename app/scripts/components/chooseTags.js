var _ = require('lodash');
var React = require('react');
var Reflux = require('reflux');
var ReactAddons = require('react/addons');
var validator = require('validator');
var Panel = require('react-bootstrap').Panel;
var Button = require('react-bootstrap').Button;

var assert = require('assert');

var InfoHeader= require('./infoHeader');
var TextInput = require('./account/textInput');
var ChooseImage = require('./account/chooseImage');
var ToolTip = require('./toolTip');

var AlbumsStore = require('../stores/AlbumsStore');
// assert(AlbumsStore, 'store is ok'+ AlbumsStore);

var AlbumsActions = require('../actions/AlbumsActions');
var WorkStore = require('../stores/WorkStore');
var UserActions = require("../actions/UserActions");
var UserStore = require("../stores/UserStore");
var History = require('react-router').History;
/*
 ѡ��������
 */
var ChooseTags = React.createClass({
  mixins : [Reflux.listenTo(AlbumsStore,'onGetCategories')],
  getInitialState : function(){
    return {
      categories : [],
      selectedTags: [],
    }
  },

  componentWillMount : function(){
    AlbumsActions.getTagList();
    if(this.props.value ){
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
    var tagId = event.target.getAttribute('data-category');
    tagId = parseInt(tagId);
    var tags = this.state.selectedTags;
    var locationOfTagId = tags.indexOf(tagId);
    var alreadySelected = locationOfTagId >= 0;

    if ( !alreadySelected ){
      //ÿ���������������������ǩ
      var allTags = this.state.tags;
      var isBreak = false;
      allTags.forEach(function (item) {
        var ids = _.map(item.Tags, 'Id');
        if(ids.indexOf(tagId) > -1){//�ж�������ı�ǩ�Ƿ�����������ڵ�
          var tmp = _.intersection(ids, tags);//�ظ�������
          //����ǩΪ��ѡ��ǩ��ֻ��ѡһ����������������������������ǩ
          if(item.Name=='���'){
            if(tmp.length >= 1){
              isBreak = true;
            }
          }else{
            if(tmp.length >= 3){
              isBreak = true;
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
  },

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
    // tag - obj, {Id: 4, Name: "����", Display: true}
    function makeButton (tag, i) {
      return (<Button key={i}
                      bsStyle={(currentTags.indexOf(tag.Id) >=0) ? 'primary' : 'default'}
                      style={style.button}
                      onClick={onClickButton}
                      data-category={tag.Id} >
        {tag.Name}
      </Button>);
    }

    function makeTagRow (tagRow,rowIndex) {
      var buttons = tagRow.Tags.map(function (tag, i) {
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

    //Ŀǰû����������Ƿ���ʾ    
    var tagList = makeTagList(this.state.tags);

    return (
      <div className="form-group">
        {tagList}
      </div>
    );
  }
});

module.exports = ChooseTags;