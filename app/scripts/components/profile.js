var React = require('react');
var Router = require('react-router');
var Link = Router.Link;

var Header = require('./header');
var Footer = require('./footer');

var ProfileHeader = React.createClass({
  render : function(){
    var headerStyle = {
      background : {
        background : 'url(../../img/footer_bg.png) no-repeat center center',
        width : '100%',
        height : '300px'
      },
      center : {
        margin : '0 auto',
        width : '40%',
        paddingTop : '100px',
        textAlign : 'center',
        color : '#777777',
        paddingBottom : '130px',
      }
    };
    var categoryStyle = {
      height : '30px',
      backgroundColor : '#ffffff',
      textAlign : 'center',
      width : '100%',
    };
    return (
      <div style={headerStyle.background}>
        <div style={headerStyle.center}>
          <img src="../../img/user.png" />
          <span>怪盗基德</span>
        </div>
        <div style={categoryStyle}>
          <Link to="/profile/onSale">
            已上架
          </Link>
          <Link to="/profile/onStore">
            未上架
          </Link>
          <Link to="/profile/fail">
            审核失败
          </Link>
        </div>
      </div>
    )
  }
});

var WorksList = React.createClass({
  
  render : function(){
    var mainStyle = {

    };
    return (
      <div style={mainStyle}>

      </div>
    );
  }
});

var Profile = React.createClass({

  render: function() {

    return (
      <div className="container-fluid no-bgimg gray-bg">
        <Header />
        <div>
          <ProfileHeader />
          <WorksList />
        </div>
        <Footer />
      </div>
    );
  }
});

module.exports = Profile;
