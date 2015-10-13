var React = require('react');
var Reflux = require('reflux');
var Router = require('react-router');
var Link = Router.Link;

var Header = require('./header');
var Footer = require('./footer');

var AlbumsActions = require('../actions/AlbumsActions');
var AlbumsStore = require('../stores/AlbumsStore');

var ProfileHeader = React.createClass({
  getDefaultProps: function () {
    return {
      avatarSrc: '../../img/user.png',
      name: '怪盗基德',
      area: '郑东新区',
      introduction: '这个人很懒，什么都没有留下',
    }
  },
  render : function(){
    var headerStyle = {
      background : {
        background : 'url(../../img/footer_bg.png) no-repeat center center',
        width : '100%',
        height : '410px',
        color: '#ffffff',
        paddingTop: '50px',
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
            <img style={headerStyle.avatar} width="150" height="150" src={this.props.avatarSrc} />
            <p style={headerStyle.name}>{this.props.name}</p>
            <p style={headerStyle.area}>{this.props.area}</p>
            <p style={headerStyle.introduction}>{this.props.introduction}</p>
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

var WorksList = React.createClass({
  mixins : [Reflux.listenTo(AlbumsStore,'onStoreChanged')],
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
      2.待审核 ： IsPending
      3.违规 ： IsFoul
    */
    return {
      type : '',
      pageIndex : 1,
    }
  },
  onStoreChanged : function(data){
    if(data.hintMessage){
      console.log(data.hintMessage);
    }else{
      this.setState({workList : data.workList});
    }
  },
  componentWillMount : function(){
    var data ={
      Fields : 'Id,Title,UserId,CategoryId,CreationTime,EditingTime,Display,Description,Cover,Photos.Id,Photos.Url',
      PageIndex : this.props.pageIndex,
      PageSize : 12,
    };
    if(this.props.type == '1'){
      data.Display = true;
      AlbumsActions.getMyAlbums(data);
    }else if(this.props.type == '2'){
      data.Display = false;
      AlbumsActions.getMyAlbums(data);
    }else if(this.props.type == '3'){
      data.IsPending = true;
      AlbumsActions.getMyAlbums(data);
    }
  },
  componentWillReceiveProps : function(nextProps){
    if(nextProps.type != this.props.type || nextProps.pageIndex != this.props.pageIndex){
      var data ={
        Fields : 'Id,Title,UserId,CategoryId,CreationTime,EditingTime,Display,Description,Cover,Photos.Id,Photos.Url',
        PageIndex : nextProps.pageIndex,
        PageSize : 12,
      };
      if(nextProps.type == '1'){
        data.Display = true;
        AlbumsActions.getMyAlbums(data);
      }else if(nextProps.type == '2'){
        data.Display = false;
        AlbumsActions.getMyAlbums(data);
      }else if(nextProps.type == '3'){
        data.IsPending = true;
        AlbumsActions.getMyAlbums(data);
      }
    }
  },
  render : function(){
    var mainStyle = {

    };
    var photoList = this.state.workList.map(function(work,i){
      return (
        <div>
          <img height='200' src={work.Cover} />
          <div>{work.Title}</div>
          <div>{work.Photos.length}张</div>
        </div>
      );
    }.bind(this));
    return (
      <div style={mainStyle}>
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
        <Footer />
      </div>
    );
  }
});

module.exports = Profile;
