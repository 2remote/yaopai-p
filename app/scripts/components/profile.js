var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var Link = Router.Link;
var History = Router.History
var MasonryMixin = require('react-masonry-mixin')(React);
var Header = require('./header');

var AlbumsActions = require('../actions/AlbumsActions');
var AlbumsStore = require('../stores/AlbumsStore');
var PhotograhperActions = require('../actions/PAuthActions');
var PhotograhperStore = require('../stores/PAuthStore');
var UserActions = require('../actions/UserActions');
var UserStore = require('../stores/UserStore');

var ProfileHeader = React.createClass({
  mixins : [Reflux.listenTo(PhotograhperStore,'onStoreChanged'),Reflux.listenTo(UserStore,'onUserStoreChanged'),History],
  getInitialState : function(){
    return {
      avatarSrc: 'img/user.png',
      name: '',
      area: '',
      introduction: '这个人很懒，什么都没有留下',
    }
  },
  onUserStoreChanged : function(data){
    if(data.isLogin){
      //获取摄影师信息
      PhotograhperActions.get({Id : data.userId,Fields : 'Id,Signature,ProvinceName,CityName,CountyName,User.Avatar,User.NickName' });
    }else{
      this.history.pushState(null,'/');
    }
  },
  onStoreChanged : function(data){
    if(data.flag == 'get'){
      if(data.hintMessage){
        console.log(data.hintMessage);
      }else{
        var info = {
          avatarSrc : data.photographer.User.Avatar?data.photographer.User.Avatar:'img/user.png',
          name : data.photographer.User.NickName,
          area : data.photographer.ProvinceName + '/' +data.photographer.CityName +'/' +data.photographer.CountyName,
          introduction : data.photographer.Signature?data.photographer.Signature : '这个人很懒，什么都没有留下'
        };
        this.setState(info);
      }
    }
  },
  componentWillMount : function(){
    UserActions.currentUser();
  },
  render : function(){
    var headerStyle = {
      background : {
        background : 'url(../../img/footer_bg.png) no-repeat center center',
        width : '100%',
        height : '360px',
        color: '#ffffff',
        marginTop: '50px',
      },
      center : {
        margin : '0 auto',
        width : '40%',
        paddingTop : '50px',
        textAlign : 'center',
        color : '#ffffff',
      },
      avatar: {
        border: '1px solid #8f8f8f',
        borderRadius: '50%',
        marginBottom: '10px',
      },
      name: {
        fontSize: '18px',
      },
      area: {
        fontSize: '12px',
        color: '#c0c0c0',
        marginBottom: '25px',
      },
      introduction: {
        fontSize: '16px',
      }
    };
    var categoryStyle = {
      wrap: {
        height : '55px',
        textAlign : 'center',
        width : '100%',
        lineHeight: '55px',
        background: '#ffffff',
      },
      select: {
        padding: '0 15px',
        color: '#828997',
      },
      activeLink: {
        padding: '0 15px',
        color: '#828997',
      },
      icon: {
        color: '#df3b3b',
        marginLeft: '-10px',
      }
    };
    return (
      <div>
        <div style={headerStyle.background}>
          <div style={headerStyle.center}>
            <img style={headerStyle.avatar} width="150" height="150" src={this.state.avatarSrc+'?imageMogr2/gravity/Center/thumbnail/!150x150r/crop/150x150/interlace/1'} />
            <p style={headerStyle.name}>{this.state.name}</p>
            <p style={headerStyle.area}>{this.state.area}</p>
            <p style={headerStyle.introduction}>{this.state.introduction}</p>
          </div>
        </div>
        <div>
          <div style={categoryStyle.wrap}>
            <Link style={categoryStyle.select} to="/profile/onSale">
              已上架
            </Link>
            <Link style={categoryStyle.activeLink} to="/profile/onStore">
              未上架
            </Link>
            <Link style={categoryStyle.select} to="/profile/fail">
              审核失败
            </Link>
            <span className="glyphicon glyphicon-exclamation-sign" style={categoryStyle.icon} aria-hidden="true"></span>
          </div>
        </div>
      </div>
    )
  }
});

/*
瀑布流布局配置参数
*/
var masonryOptions = {
  transitionDuration: '2s',
  gutter: 15,
  isFitWidth: true,
};
var WorksList = React.createClass({
  mixins : [Reflux.listenTo(AlbumsStore,'onStoreChanged'),
    Reflux.listenTo(UserStore,'onUserStoreChanged'),
    MasonryMixin('masonryContainer', masonryOptions)],
  getInitialState : function(){
    return {
      workList : []
    }
  },
  getDefaultProps : function(){
    /*
      有三种状态
      1.上架：Display ＝ true
      2.下架：Display ＝ false
      2.待审核 ： state = 0
      3.违规 ： state = 2
    */
    return {
      type : '',
      pageIndex : 1,
    }
  },
  onUserStoreChanged : function(data){
    if(data.isLogin){
      //获取摄影师的相册
      this.getMyAlbums(data.userId);
    }else{
      this.history.pushState(null,'/');
    }
  },
  onStoreChanged : function(data){
    if(data.hintMessage){
      console.log(data.hintMessage);
    }else{
      this.setState({workList : data.workList});
    }
  },
  getMyAlbums : function(id){
    var data ={
      Fields : 'Id,Title,UserId,CategoryId,CreationTime,EditingTime,Display,Description,Cover,Photos.Id,Photos.Url',
      //PageIndex : this.props.pageIndex,
      //PageSize : 12,
      UserId : id,
    };
    if(this.props.type == '1'){
      data.Display = true;
      AlbumsActions.getMyAlbums(data);
    }else if(this.props.type == '2'){
      data.Display = false;
      AlbumsActions.getMyAlbums(data);
    }else if(this.props.type == '3'){
      data.state = 0;
      AlbumsActions.getMyAlbums(data);
    }
  },
  render : function(){
    var mainStyle = {
      worksWrap: {
        marginBottom: '15px',
        position: 'relative',
      },
      description: {
        width: '100%',
        paddingLeft: '7px',
        position: 'absolute',
        left: 0,
        bottom: 0,
        background: 'rgba(0,0,0,.1)',
        color: '#fefff9',
      },
      container: {
        margin: '0 auto',
      },
      number: {
        fontSize: '12px',
        paddingLeft: '10px',
      }
    };
    var photoList = this.state.workList.map(function(work,i){
      return (
        <div style={mainStyle.worksWrap}>
          <img width='300' src={work.Cover+'?imageView2/2/w/300/interlace/1'} />
          <div style={mainStyle.description}>
            <p><span>{work.Title}</span><span style={mainStyle.number}>{work.Photos.length}张</span></p>
          </div>
        </div>
      );
    }.bind(this));
    return (
      <div ref="masonryContainer" style={mainStyle.container}>
        {photoList}
      </div>
    );
  }
});

var Profile = React.createClass({
  getInitialState : function(){
    return {
      type : '',
      pageIndex : 1,
    }
  },
  render: function() {
    return (
      <div className="container-fluid no-bgimg gray-bg">
        <Header />
        <div>
          <ProfileHeader />
          <WorksList
            type={this.props.params.type =='onSale'?'1':this.props.params.type =='onStore'?'2':this.props.params.type=='fail'?'3':''}
            pageIndex = {this.state.pageIndex}/>
        </div>
      </div>
    );
  }
});

module.exports = Profile;
