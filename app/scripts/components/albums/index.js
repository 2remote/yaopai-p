var React = require('react');
var Reflux = require('reflux');
var Header = require('./../header');
var ComponentGallery = require('react-component-gallery');
var AlbumsActions = require('../../actions/AlbumsActions');
var AlbumsStore = require('../../stores/AlbumsStore');
var RightAlbumInfo = require('./rightAlbumInfo');

var Albums = React.createClass({
  mixins: [Reflux.listenTo(AlbumsStore, 'onStoreChanged')],
  getInitialState: function () {
    return {
      work: null,
      currentAlbum: AlbumsStore.data,
      category: '',
    }
  },
  onStoreChanged: function (data) {
    if (data.hintMessage) {
      console.log(data.hintMessage);
    } else {
      this.setState({work: data.workData});
    }
  },
  componentDidMount: function () {
    this.loadAlbums();
    //console.log(this.state.currentAlbum);
    //console.log(this.state.currentAlbum.categories);
    //this.state.category = this.state.currentAlbum.categories.find(function (obj) {
    //  console.log(obj.Id);
    //  console.log(this.state.currentAlbum.workData.CategoryId);
    //  return obj.Id == this.state.currentAlbum.workData.CategoryId;
    //})
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
    var photoList = <div></div>
    if (this.state.work && this.state.work.Photos) {
      var photoList = this.state.work.Photos.map(function (photo, i) {
        var coverStyle = {}
        if (this.state.work.Cover == photo.Url) {
          coverStyle = {
            color: "red"
          }
        }
        var cover = <span data-index={i} onClick={this.onCover} style={coverStyle}>设置封面</span>
        if (coverStyle.color) {
          cover = <span data-index={i} onClick={this.onCover} style={coverStyle}>已封面</span>
        }
        return (
          <div key={i}>
            <div>
              <span data-index={i} onClick={this.onRemove}>删除</span>
              {cover}
              <span data-index={i} onClick={this.onMoveUp}>上</span>
              <span data-index={i} onClick={this.onMoveDown}>下</span>
            </div>
            <img key={photo.Id} src={photo.Url}/>
          </div>
        );
      }.bind(this));
    }
    return (
      <div className="container-fluid no-bgimg gray-bg" style={{backgroundColor:'#111822',height:'100%'}}>
        <Header />
        <div style={{marginTop:100,color:'#fff'}} >
          <div className="col-md-10">
            <div style={{background:'url(../../../img/tag-bg.png) no-repeat',width:'100px',height:'53px',float:'left'}}>
              <div style={{height:'13px'}}></div>
              <div style={{color:'#fff',marginLeft:'15px',fontSize:'20px'}}>生活{this.state.category}</div>
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
            <RightAlbumInfo work={this.state.work} uploadHandle={this.loadAlbums}>
            </RightAlbumInfo>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Albums;
