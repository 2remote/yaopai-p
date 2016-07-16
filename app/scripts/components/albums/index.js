import React from 'react'
import Reflux from 'reflux'

import { ROUTE_LOGIN } from '../../routeConfig'
import { History} from 'react-router'

import Navbar from '../root/Navbar'
import ComponentGallery from 'react-component-gallery'
import RightAlbumInfo from './rightAlbumInfo'

import AlbumsStore from '../../stores/AlbumsStore'
import UserStore from '../../stores/UserStore'

import AlbumsActions from '../../actions/AlbumsActions'
import UserActions from '../../actions/UserActions'

import Tools from '../../tools'
import ToolTip from '../toolTip'
import _ from 'lodash'

/**
 * 作品详情页组件
 * @type {*|Function}
 */
const Albums = React.createClass({
  mixins: [
    Reflux.listenTo(AlbumsStore, 'onStoreChanged'),
    Reflux.listenTo(UserStore, 'isLogin'),
    History
  ],
  onStoreChanged: function (data) {
    if (data.hintMessage) {
      console.log(data.hintMessage);
    } else {
      if (data.flag == 'get') {
        this.setState({work: data.workData});
      }
      if (data.flag == 'getCategories') {
        this.setState({categories: data.categories});
      }
      if (data.flag == 'getTagList') {
        this.setState({tags: data.tags});
      }
      if (data.flag == 'delete') {
        this.history.replaceState(null, ROUTE_LOGIN);
      }
      if (data.flag == 'update') {
        if (this.state.cropCover) {
          this.showMessage('封面设置成功');
          this.setState({cropCover: ''})
        }
      }
      this.setState({category: {Name: '其他'}});
      if (this.state.work && this.state.work.Tags && this.state.tags && (typeof this.state.work.Tags == 'object') && this.state.work.Tags.constructor == Array) {
        var album = this.state.work;
        var cateTag = this.state.tags.find(function (obj) {
          return obj.Name == '类别';
        })
        if (cateTag && cateTag.Tags) {
          var cateTagIds = _.map(cateTag.Tags, 'Id');
          var category = album.Tags.find(function (item) {
            return cateTagIds.indexOf(item.Id) > -1
          })
          if (category) {
            this.setState({category: category});
          }
        }

      }
    }
  },
  isLogin: function (data) {
    if (!data.isLogin) {
      //没有登录跳转到首页登录界面
      //UserActions.logout(true);
      this.history.pushState(null, ROUTE_LOGIN);
    } else {
      this.loadAlbums();
    }
  },
  getInitialState: function () {
    return {
      work: null,
      currentAlbum: AlbumsStore.data,
      categories: null,
      category: null,
      tags: null,
    }
  },
  componentWillMount: function () {
    //获取到当前的用户信息
    UserActions.currentUser();
    //获取标签列表
    AlbumsActions.getTagList();
  },
  onRemove: function (event) {
    var index = event.target.getAttribute('data-index');
    var album = this.state.work;
    if (album.Photos.length <= 1) {
      if (confirm("这是最后一张咯!删除这一张相册也会删除掉哦~")) {
        AlbumsActions.delete(album);
      }
    } else {
      var removeUrl = album.Photos[index].Url;
      album.Photos.splice(index, 1);
      if (removeUrl == album.Cover) {
        this.setState({work: album});
        this.crop(album.Photos[0].Url);
      } else {
        AlbumsActions.update(album);
      }
    }
  },
  onCover: function (event) {
    var self = this;
    var index = event.target.getAttribute('data-index');
    var src = this.state.work.Photos[index].Url;
    Tools.crop(src, function (cut) {
      var album = self.state.work;
      album.Cut = JSON.stringify(cut);
      album.Cover = src;
      AlbumsActions.update(album);
    });
  },
  onMoveUp: function (event) {
    var index = event.target.getAttribute('data-index');
    var album = this.state.work;
    if (index > 0) {
      var photo1 = album.Photos[index];
      var photo2 = album.Photos[parseInt(index) - 1];
      album.Photos.splice(index, 1, photo2);
      album.Photos.splice(parseInt(index) - 1, 1, photo1);
      AlbumsActions.update(album);
    }
  },
  onMoveDown: function (event) {
    var index = event.target.getAttribute('data-index');
    var album = this.state.work;
    if (index < album.Photos.length - 1) {
      var photo1 = album.Photos[index];
      var photo2 = album.Photos[parseInt(index) + 1];
      album.Photos.splice(parseInt(index) + 1, 1, photo1);
      album.Photos.splice(index, 1, photo2);
      AlbumsActions.update(album);
    }
  },
  showMessage: function (message) {
    this.refs.toolTip2.toShow(message);
  },
  loadAlbums: function () {
    var id = this.props.params.id;
    var data = {
      Fields: 'Id,Title,UserId,Service,Price,CreationTime,EditingTime,Display,Description,Cover,Photos.Id,Photos.Url,State,CreationTime,EditingTime,Tags.Id,Tags.Name,' +
      'Detail.Duration,Detail.PlateCount,Detail.TruingCount,Detail.CostumeCount,Detail.MakeUpSupport,Detail.OriginalSupport,Detail.PhysicalSupport,Detail.UnitCount,Detail.SceneCount,' +
      'Detail.PeopleCount,Detail.SeatCount,Detail.PlaceType,Detail.PhysicalDetail',
      Id: id,
    };
    AlbumsActions.get(data)
  },
  render: function () {
    var mainStyle = {
      prev: {
        width: '100%',
        paddingLeft: '7px',
        position: 'absolute',
        top: 0,
        color: '#fefff9',
        opacity: '0',
        background: 'rgba(0,0,0,.3)',
        WebkitTransition: 'opacity 0.2s',
        MozTransition: 'opacity 0.2s',
        transition: 'opacity 0.2s',
        height: '35px',
        lineHeight: '35px'
      },

      description: {
        width: '100%',
        paddingLeft: '7px',
        position: 'absolute',
        bottom: 0,
        color: '#fefff9',
        textAlign: 'center',
        opacity: '0',
        background: 'rgba(0,0,0,.3)',
        WebkitTransition: 'opacity 0.2s',
        MozTransition: 'opacity 0.2s',
        transition: 'opacity 0.2s',
        height: '35px',
        lineHeight: '35px'
      },
      up: {
        transition: 'top 0.2s',
        color: 'white',
        float: "right",
        textShadow: '0 0 1px rgba(0,0,0,0.6)',
        marginRight: 20,
        height: '35px',
        lineHeight: '35px'
      },
      down: {
        transition: 'top 0.2s',
        color: 'white',
        float: "right",
        textShadow: '0 0 1px rgba(0,0,0,0.6)',
        marginRight: 20,
        height: '35px',
        lineHeight: '35px'

      },
      delete: {
        transition: 'top 0.2s',
        color: 'white',
        float: "left",
        textShadow: '0 0 1px rgba(0,0,0,0.6)',
        marginLeft: 20,
        height: '35px',
        lineHeight: '35px'
      },
      spanText: {
        padding: '0 10px 0 20px',
        fontSize: '14px',
        fontWeight: '100',
        cursor: 'pointer',
        verticalAlign: 'text-bottom',
      }
    };
    if (this.state.work && this.state.category) {
      var photoList = <div></div>
      if (this.state.work.Photos) {
        var photoList = this.state.work.Photos.map(function (photo, i) {
          var coverStyle = {
            transition: 'top 0.2s',
            fontSize: 14,
            textShadow: '0 0 1px rgba(0,0,0,0.6)',
            display: 'inline-block',
          }
          if (this.state.work.Cover == photo.Url) {
            coverStyle.color = "black";
          }
          var cover = <span style={mainStyle.spanText} data-index={i} onClick={this.onCover}>设为封面</span>
          if (coverStyle.color) {
            cover = <span style={mainStyle.spanText} data-index={i} onClick={this.onCover}>当前封面</span>
          }
          return (
            <div style={{width: '100%', margin: 'auto'}} key={i}>
              <div className='imghover' style={mainStyle.prev}>
                  <span style={mainStyle.up}>
                    <span style={{fontSize:14,marginRight:-25,position:'absolute'}} className="icon up_icon"/>
                    <span style={mainStyle.spanText} data-index={i} onClick={this.onMoveUp}>上移</span>
                  </span>
              </div>
              <img key={photo.Id} style={{width:'100%'}}
                   src={photo.Url+'?imageMogr2/auto-orient/thumbnail/600x/interlace/1'}/>
              <div className='imghover' style={mainStyle.description}>
                  <span style={mainStyle.delete}>
                    <span style={{fontSize:14,marginRight:-25,position:'absolute'}}
                          className="icon cancel_circle_icon"/>
                    <span style={mainStyle.spanText} data-index={i} onClick={this.onRemove}>删除</span>
                  </span>
                  <span style={coverStyle}>
                    <span style={{fontSize:14,marginRight:-25,position:'absolute'}} className="icon work_icon"/>
                    {cover}
                  </span>
                  <span style={mainStyle.down}>
                    <span style={{fontSize:14,marginRight:-25,position:'absolute'}} className="icon down_icon"/>
                    <span style={mainStyle.spanText} data-index={i} onClick={this.onMoveDown}>下移</span>
                  </span>
              </div>
            </div>
          );
        }.bind(this));
      }
      return (
        <div>
          <Navbar />
          <div className="container-fluid">
            <div className="album-detail row">
              {/* 封面图预览模块 */}
              <div className="preview col-md-3">
                <h2>实时预览</h2>
                <div className="preview-list">
                  {/* 作品预览封面图列表 */}
                  <ComponentGallery
                    componentStyle={{
                     width: "auto",
                     height: "auto",
                     textAlign: 'center',
                     display: "block",
                     margin: "10px auto",
                     overflow: "hidden",
                     position: "relative",
                     verticalAlign: "top"
                     }}>
                    {photoList}
                  </ComponentGallery>
                </div>
              </div>

              {/* 详细信息预览模块 */}
              <RightAlbumInfo work={this.state.work} uploadHandle={this.loadAlbums} categories={this.state.category.Name}>
              </RightAlbumInfo>
            </div>
            <ToolTip ref="toolTip2" title=""/>
          </div>

        </div>
      );
    } else {
      return (
        <div>
        </div>
      )
    }
  }
});

module.exports = Albums;
