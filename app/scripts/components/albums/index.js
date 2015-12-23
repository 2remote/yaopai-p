var React = require('react');
var Reflux = require('reflux');
var History = require('react-router').History;
var Header = require('./../header');
var ComponentGallery = require('react-component-gallery');
var AlbumsActions = require('../../actions/AlbumsActions');
var AlbumsStore = require('../../stores/AlbumsStore');
var RightAlbumInfo = require('./rightAlbumInfo');
var UserStore = require('../../stores/UserStore');
var UserActions = require("../../actions/UserActions");

var Albums = React.createClass({
  mixins: [Reflux.listenTo(AlbumsStore, 'onStoreChanged'),,Reflux.listenTo(UserStore,'isLogin'), History],
  getInitialState: function () {
    return {
      work: null,
      currentAlbum: AlbumsStore.data,
      categories :null,
      category:null,
    }
  },
  onStoreChanged: function (data) {
    if (data.hintMessage) {
      console.log(data.hintMessage);
    } else {
      if(data.flag == 'get') {
        this.setState({work: data.workData});
      }
      if(data.flag == 'getCategories'){
        this.setState({categories: data.categories});
      }
      if (this.state.work && this.state.work.CategoryId && this.state.categories) {
        var album = this.state.work;
        var category = this.state.categories.find(function (obj) {
          return obj.Id == album.CategoryId;
        })
        this.setState({category: category});
      }
    }
  },
  isLogin: function (data) {
    if (!data.isLogin) {
      //没有登录跳转到首页登录界面
      UserActions.logout(true);
      this.history.pushState(null, '/');
    }
  },
  componentDidMount: function () {
    var data = {
      Fields: 'Id,Name'
    };
    AlbumsActions.getCategories(data)
    this.loadAlbums();
    UserActions.currentUser();
  },
  onRemove: function (event) {
    var index = event.target.getAttribute('data-index');
    var album = this.state.work;
    var removeUrl = album.Photos[index].Url;
    album.Photos.splice(index, 1);
    if (removeUrl == album.Cover) {
      album.Cover = album.Photos[0].Url;
    }
    AlbumsActions.update(album);
  },
  onCover: function (event) {
    var index = event.target.getAttribute('data-index');
    var album = this.state.work;
    album.Cover = this.state.work.Photos[index].Url;
    AlbumsActions.update(album);
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
  loadAlbums: function () {
    var id = this.props.params.id;
    var data = {
      Fields: 'Id,Title,UserId,Service,Price,CategoryId,CreationTime,EditingTime,Display,Description,Cover,Photos.Id,Photos.Url,State,CreationTime,EditingTime',
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
        left: 0,
        top: 0,
        background: 'rgba(0,0,0,.1)',
        color: '#fefff9',
      },
      description: {
        width: '100%',
        paddingLeft: '7px',
        position: 'absolute',
        left: 0,
        bottom: 0,
        background: 'rgba(0,0,0,.1)',
        color: '#fefff9',
        textAlign:'center',
      },
    };
    if (this.state.work && this.state.category) {
      var photoList = <div></div>
      if (this.state.work.Photos) {
        var photoList = this.state.work.Photos.map(function (photo, i) {
          var coverStyle = {}
          if (this.state.work.Cover == photo.Url) {
            coverStyle.color = "red";
          }
          var cover = <span data-index={i} onClick={this.onCover} style={coverStyle}>设置封面</span>
          if (coverStyle.color) {
            cover = <span data-index={i} onClick={this.onCover} style={coverStyle}>已封面</span>
          }
          return (
              <div key={i}>
                <div style={mainStyle.prev}>
                  <span data-index={i} onClick={this.onMoveUp} style={{float:"right"}}>上</span>
                </div>
                <img key={photo.Id} src={photo.Url}/>
                <div style={mainStyle.description}>
                  <span data-index={i} onClick={this.onRemove} style={{float:"left"}}>删除</span>
                  {cover}
                  <span data-index={i} onClick={this.onMoveDown} style={{float:"right"}}>下</span>
                </div>
              </div>
          );
        }.bind(this));
      }
      return (
          <div className="container-fluid" style={{backgroundColor:'#111822'}}>
            <Header />
            <div style={{marginTop:100,color:'#fff'}} >
              <div className="col-md-10">
                <div style={{background:'url(../../../img/tag-bg.png) no-repeat',width:'100px',height:'53px',float:'left'}}>
                  <div style={{height:'13px'}}></div>
                  <div style={{color:'#fff',marginLeft:'15px',fontSize:'20px'}}>{this.state.category.Name}</div>
                </div>
                <div style={{height:'53px'}}>
                  <div style={{height:'13px'}}></div>
                  <div style={{color:'#fff',fontSize:'20px'}}>{this.state.currentAlbum.workData.Title}</div>
                </div>
                <ComponentGallery
                  componentStyle={{
                    width: "auto",
                    height: "auto%",
                    marginTop: "20px",
                    display: "inline-block",
                    marginRight: "10px",
                    marginBottom: "10px",
                    overflow: "hidden",
                    position: "relative",
                    verticalAlign: "top"
                  }}>
                  {photoList}
                </ComponentGallery>
              </div>
              <div className="col-md-2">
                <RightAlbumInfo work={this.state.work} uploadHandle={this.loadAlbums} categories={this.state.categories}>
                </RightAlbumInfo>
              </div>
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
