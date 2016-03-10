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
  mixins: [Reflux.listenTo(AlbumsStore, 'onStoreChanged'),Reflux.listenTo(UserStore,'isLogin'), History],
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
      if(data.flag == 'delete') {
        this.history.replaceState(null,'/profile/onSale');
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
      //UserActions.logout(true);
      this.history.pushState(null, '/');
    }else{
      var data = {
        Fields: 'Id,Name'
      };
      AlbumsActions.getCategories(data)
      this.loadAlbums();
    }
  },
  componentWillMount: function () {
    UserActions.currentUser();
  },
  onRemove: function (event) {
    var index = event.target.getAttribute('data-index');
    var album = this.state.work;
    if(album.Photos.length <= 1){
      if(confirm("这是相册的最后一张照片，删除此照片将删除相册。")){
        AlbumsActions.delete(album);
      }
    }else{
      var removeUrl = album.Photos[index].Url;
      album.Photos.splice(index, 1);
      if (removeUrl == album.Cover) {
        album.Cover = album.Photos[0].Url;
      }
      AlbumsActions.update(album);
    }
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
      Fields: 'Id,Title,UserId,Service,Price,CategoryId,CreationTime,EditingTime,Display,Description,Cover,Photos.Id,Photos.Url,State,CreationTime,EditingTime,Tags.Id,Tags.Name',
      Id: id,
    };
    AlbumsActions.get(data)
  },
  render: function () {
    var mainStyle = {
      prev: {
        width: 600,
        paddingLeft: '7px',
        position: 'absolute',
        top: 0,
        color: '#fefff9',
        opacity: '0',
        background: '-webkit-gradient(linear, left bottom, left top, from(rgba(0,0,0,0)), to(rgba(0,0,0,0.6)))',
        background: '-webkit-linear-gradient(bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)',
        background: '-moz-linear-gradient(bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)',
        background: 'linear-gradient(to top, rgba(0,0,0,0) 0%,rgba(0,0,0,0.6) 100%)',
        WebkitTransition: 'opacity 0.2s',
        MozTransition: 'opacity 0.2s',
        transition: 'opacity 0.2s',
        height: 50,
      },
      description: {
        width: 600,
        paddingLeft: '7px',
        position: 'absolute',
        bottom: 0,
        color: '#fefff9',
        textAlign:'center',
        opacity: '0',
        background: '-webkit-gradient(linear, left bottom, left top, from(rgba(0,0,0,0.6)), to(rgba(0,0,0,0)))',
        background: '-webkit-linear-gradient(bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)',
        background: '-moz-linear-gradient(bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 100%)',
        background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%,rgba(0,0,0,0) 100%)',
        WebkitTransition: 'opacity 0.2s',
        MozTransition: 'opacity 0.2s',
        transition: 'opacity 0.2s',
        height: 50,
      },
      up:{
        transition: 'top 0.2s',
        fontSize: 18,
        color: 'white',
        float:"right",
        textShadow: '0 0 1px rgba(0,0,0,0.6)',
        marginRight: 20,
        marginTop: 5,
      },
      down:{
        transition: 'top 0.2s',
        fontSize: 18,
        color: 'white',
        float:"right",
        textShadow: '0 0 1px rgba(0,0,0,0.6)',
        marginRight: 20,
        marginTop: 15,
      },
      delete:{
        transition: 'top 0.2s',
        fontSize: 18,
        color: 'white',
        float:"left",
        textShadow: '0 0 1px rgba(0,0,0,0.6)',
        marginLeft: 20,
        marginTop: 15,
      },
      spanText:{
        padding: '0 10px 0 30px',
        verticalAlign: 'text-bottom'
      }
    };
    if (this.state.work && this.state.category) {
      var photoList = <div></div>
      if (this.state.work.Photos) {
        var photoList = this.state.work.Photos.map(function (photo, i) {
          var coverStyle = {
            transition: 'top 0.2s',
            fontSize: 18,
            textShadow: '0 0 1px rgba(0,0,0,0.6)',
            display: 'inline-block',
            marginTop: 15,
          }
          if (this.state.work.Cover == photo.Url) {
            coverStyle.color = "red";
          }
          var cover = <span style={mainStyle.spanText} data-index={i} onClick={this.onCover}>设为封面</span>
          if (coverStyle.color) {
            cover = <span style={mainStyle.spanText} data-index={i} onClick={this.onCover}>封面</span>
          }
          return (
              <div style={{width: 600, margin: 'auto'}} key={i}>
                <div className='imghover' style={mainStyle.prev}>
                  <span style={mainStyle.up}>
                    <span style={{fontSize:25,marginRight:-25}} className="icon up_icon" />
                    <span style={mainStyle.spanText}  data-index={i} onClick={this.onMoveUp} >上移</span>
                  </span>
                </div>
                <img key={photo.Id} src={photo.Url+'?imageMogr2/auto-orient/thumbnail/600x/interlace/1'}/>
                <div className='imghover' style={mainStyle.description}>
                  <span style={mainStyle.delete}>
                    <span style={{fontSize:25,marginRight:-25}} className="icon cancel_circle_icon" />
                    <span style={mainStyle.spanText}  data-index={i} onClick={this.onRemove} >删除</span>
                  </span>
                  <span style={coverStyle}>
                    <span style={{fontSize:25,marginRight:-25}} className="icon work_icon" /> 
                    {cover}
                  </span>
                  <span style={mainStyle.down}>
                    <span style={{fontSize:25,marginRight:-25}} className="icon down_icon" />
                    <span style={mainStyle.spanText} data-index={i} onClick={this.onMoveDown} >下移</span>
                  </span>
                </div>
              </div>
          );
        }.bind(this));
      }
      return (
          <div className="container-fluid" style={{backgroundColor:'#111822',minHeight:1000}}>
            <Header />
            <div style={{marginTop:100,color:'#fff'}} >
              <div className="col-md-9">
                <div style={{width: 600, margin: 'auto'}}>
                  <div style={{background:'url(../../../img/tag-bg.png) no-repeat',width:'100px',height:'53px',float:'left'}}>
                    <div style={{height:'13px'}}></div>
                    <div style={{color:'#fff',marginLeft:'15px',fontSize:'20px'}}>{this.state.category.Name}</div>
                  </div>
                  <div style={{height:'53px'}}>
                    <div style={{height:'13px'}}></div>
                    <div style={{color:'#fff',fontSize:'20px'}}>{this.state.currentAlbum.workData.Title}</div>
                  </div>
                </div>
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
              <div className="col-md-3">
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
