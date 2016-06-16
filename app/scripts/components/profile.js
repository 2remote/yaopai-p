var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var Link = Router.Link;
var History = Router.History
var MasonryMixin = require('react-masonry-mixin')(React);
var Header = require('./header');
var NoData = require('./noData');

var AlbumsActions = require('../actions/AlbumsActions');
var AlbumsStore = require('../stores/AlbumsStore');
var PhotograhperActions = require('../actions/PAuthActions');
var PhotograhperStore = require('../stores/PAuthStore');
var UserActions = require('../actions/UserActions');
var UserStore = require('../stores/UserStore');
var QRCode = require('qrcode.react');
var _ = require('lodash');
var ProfileHeader = React.createClass({
  mixins : [Reflux.listenTo(UserStore,'onUserStoreChanged'),History],
  getInitialState : function(){
    return {
      avatarSrc: 'img/user.png',
      name: '',
      area: '',
      introduction: '这个人很懒，什么都没有留下',
      type:'',
      id : '',
    }
  },
  onUserStoreChanged : function(data){
    if(data.isLogin){
      //获取摄影师信息
      //PhotograhperActions.get({Id : data.userId,Fields : 'Id,Signature,ProvinceName,CityName,CountyName,User.Avatar,User.NickName' });
      var info = {
        id : data.userId,
        avatarSrc : data.avatar?data.avatar:'img/user.png',
        name : data.userName,
        area : data.provinceName + '/' +data.cityName +'/' +data.countyName,
        introduction : data.signature?data.signature : '这个人很懒，什么都没有留下'
      };
      this.setState(info);
    }else{
      this.history.pushState(null,'/');
    }
  },
  //onStoreChanged : function(data){
  //  if(data.flag == 'get'){
  //    if(data.hintMessage){
  //      console.log(data.hintMessage);
  //    }else{
  //      var info = {
  //        id : data.photographer.Id,
  //        avatarSrc : data.photographer.User.Avatar?data.photographer.User.Avatar:'img/user.png',
  //        name : data.photographer.User.NickName,
  //        area : data.photographer.ProvinceName + '/' +data.photographer.CityName +'/' +data.photographer.CountyName,
  //        introduction : data.photographer.Signature?data.photographer.Signature : '这个人很懒，什么都没有留下'
  //      };
  //      this.setState(info);
  //    }
  //  }
  //},
  componentWillMount : function(){
    UserActions.currentUser();
  },
  componentDidMount: function () {
    this.setState({type:this.props.type})
  },
  componentWillReceiveProps : function (nextProps) {
    this.setState({type:nextProps.type})
  },
  render : function(){
    var headerStyle = {
      background : {
        background : 'url(../../img/noName2.jpg) no-repeat ',
        width : '100%',
        height : '360px',
        color: '#ffffff',
        marginTop: '50px',
        backgroundSize:'100%'
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
      },
      qrcodes : {
        height : '160px',
        width:'500px',
        marginTop:'-170',
        marginLeft:'70%',
        float:'left'
      },
      qrcode : {
        backgroundColor: '#fff',
        height : '160px',
        width:'160px',
        padding : '10px',
        float:'left'
      },
      qrcode2 : {
        backgroundColor: '#fff',
        height : '160px',
        width:'160px',
        marginLeft:'30px',
        float:'left'
      },
      qrfonts : {
        marginTop : '-10',
        height : '40px',
        width:'500px',
        marginLeft:'70%',
        float:'left'
      },
      qrfont : {
        backgroundColor: '#fff',
        color : '#000',
        fontSize : '10',
        textAlign : 'center',
        height : '30px',
        width:'160px',
        float:'left'
      },
      qrfont2 : {
        backgroundColor: '#fff',
        color : '#000',
        fontSize : '10',
        textAlign : 'center',
        height : '30px',
        width:'160px',
        marginLeft:'30px',
        float:'left'
      },
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
        color: 'black',
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
          <div style={headerStyle.qrcodes}>
          <div style={headerStyle.qrcode}>
            <QRCode value={'http://m.aiyaopai.com/#/grapherDetail/'+this.state.id} size={140}/>
          </div>
          <div style={headerStyle.qrcode2}>
            <img width="160" height="160" src='../../img/qrcode_dingyue.jpg'/>
          </div>
        </div>
        <div style={headerStyle.qrfonts}>
          <div style={headerStyle.qrfont}>
            微信扫描查看个人主页
          </div>
          <div style={headerStyle.qrfont2}>
            YAOPAI官微查看更多摄影师
          </div>
        </div>
        </div>
        <div>
          <div style={categoryStyle.wrap}>
            <Link style={this.state.type=='onSale'?categoryStyle.activeLink:categoryStyle.select} to="/profile/onSale">
              已上架
            </Link>
            <Link style={this.state.type=='onStore'?categoryStyle.activeLink:categoryStyle.select} to="/profile/onStore">
              未上架
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
      userId :null,
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
      this.setState({userId:data.userId})
      //获取摄影师的相册
      this.getMyAlbums(data.userId,this.props.type);
    }else{
      this.history.pushState(null,'/');
    }
  },
  onStoreChanged : function(data){
    if(data.hintMessage){
      console.log(data.hintMessage);
    }else{
      if(data.flag == 'sorting'){
        this.getMyAlbums(this.state.userId,this.props.type)
      }else{
        var ids = _.map(data.workList, 'Id');
        this.setState({workList : data.workList,workIds:ids});
      }
    }
  },
  componentWillReceiveProps : function (nextProps) {
    if(this.state.userId){
      this.getMyAlbums(this.state.userId,nextProps.type)
    }
  },
  getMyAlbums : function(id,type){
    var data ={
      Fields : 'Id,Title,UserId,CategoryId,CreationTime,EditingTime,Display,Description,Cover,Photos.Id,Photos.Url',
      //PageIndex : this.props.pageIndex,
      //PageSize : 12,
      UserId : id,
    };
    if(type == '1'){
      data.Display = true;
      AlbumsActions.getMyAlbums(data);
    }else if(type == '2'){
      data.Display = false;
      AlbumsActions.getMyAlbums(data);
    }else if(type == '3'){
      data.state = 0;
      AlbumsActions.getMyAlbums(data);
    }
  },
  onMoveUp : function (id,index) {
    var workIds = this.state.workIds;
    if(index>0){
      workIds.splice(index, 1);
      workIds.splice(index-1, 0, id);
    }
    AlbumsActions.sorting(workIds.join(','));
  },
  onMoveDown : function (id,index) {
    var workIds = this.state.workIds;
    if(index<workIds.length-1){
      workIds.splice(index, 1);
      workIds.splice(index+1, 0, id);
    }
    AlbumsActions.sorting(workIds.join(','));
  },
  onImgError: function (obj) {
    obj.target.src="../../../img/loaderror.png";
  },
  render : function(){
    var mainStyle = {
      worksWrap: {
        marginBottom: '15px',
        position: 'relative',
      },
      description: {
        width: '100%',
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
      },
      up:{
        opacity: '0',
        transition: 'top 0.2s',
        fontSize: 12,
        color: 'white',
        float:"left",
        textShadow: '0 0 1px rgba(0,0,0,0.6)',
        marginLift: 10,
      },
      down:{
        opacity: '0',
        transition: 'top 0.2s',
        fontSize: 12,
        color: 'white',
        float:"right",
        textShadow: '0 0 1px rgba(0,0,0,0.6)',
        marginRight: 20,
      },
    };

    var photoList = '';

    if(this.state.workList && this.state.workList.length >0){
      photoList = this.state.workList.map(function(work,i){
        return (
          <div key={i} style={mainStyle.worksWrap} className='component-wrapper'>
            <Link to={'/albums/'+work.Id}>
              <img width='300' src={work.Cover+'?imageView2/2/w/300/interlace/1'} onError={this.onImgError}/>
            </Link>
            <div style={mainStyle.description}>
              <p>
                <span className='imghover' style={mainStyle.up} onClick={this.onMoveUp.bind(this,work.Id,i)} >
                  <span style={{fontSize:18,marginRight:-18}} className="glyphicon glyphicon-triangle-left" />
                </span>
                <span style={{paddingLeft: '27px'}}>
                  <span>{work.Title}</span>
                  <span style={mainStyle.number}>{work.Photos.length}张</span>
                </span>
                <span className='imghover' style={mainStyle.down} onClick={this.onMoveDown.bind(this,work.Id,i)} >
                  <span style={{fontSize:18,marginRight:-18}} className="glyphicon glyphicon-triangle-right" />
                </span>
              </p>
            </div>
          </div>
        );
      }.bind(this));
    }else{
      photoList = <NoData message="您还没有作品，快去上传或上架吧！"/>;
      if(this.props.type == 2){
        photoList = <NoData message="暂无未上架作品"/>;
      }
    }


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
  componentDidMount: function () {
    this.setState({type:this.props.params.type})
  },
  componentWillReceiveProps : function (nextProps) {
    this.setState({type:nextProps.params.type})
  },
  render: function() {
    return (
      <div>
        <Header />
        <div className="container-fluid no-bgimg gray-bg">
          <div  className="container-fluid">
            <div className="row" style={{padding: 10}}>
              <div className="col-sm-3 hidden-xs">
                <ProfileHeader type={this.state.type}/>
              </div>
              <div className="col-sm-9">
                <div className="panel panel-default">
                  <div className="panel-body">    
                    <WorksList
                      type={this.state.type =='onSale'?'1':this.state.type =='onStore'?'2':this.state.type=='fail'?'3':''}
                      pageIndex = {this.state.pageIndex}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});

module.exports = Profile;
