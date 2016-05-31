var React = require('react');
var { Link } = require('react-router');
var ImageInput = require('../account/imageInput');
var ToolTip = require('../toolTip');

/*
  身份证图片上传
*/
var PersonIDImage = React.createClass({
  getInitialState: function(){
    return {
      facecodeDefaultImage : 'img/facecode.png',
      oppositeDefaultImage : 'img/opposite.png',
    }
  },
  getValue : function(){
    var v1 = this.refs.IDPicture1.getValue();
    var v2 = this.refs.IDPicture2.getValue();
    if(v1 && v2 && v1!=this.state.facecodeDefaultImage && v2!=this.state.oppositeDefaultImage){
      return v1+','+v2;
    }else{
      return null;
    }
  },
  upload1 : function(url){
    this.props.upload1(url);
  },
  upload2 : function(url){
    this.props.upload2(url);
  },
  render : function(){
    var style = {
      imgId: {
        marginBottom: '14px',
      },
      info: {
        marginLeft: '70px',
        height: '150px',
        paddingTop: '36px',
      },
      label: {
        lineHeight: '150px',
      },
    };
    var IDImages = [];
    IDImages[0] = this.state.facecodeDefaultImage;
    IDImages[1] = this.state.oppositeDefaultImage;
    if(this.props.value){
      var tmp = this.props.value.split(',');
      if(tmp[0])
        IDImages[0] = tmp[0];
      if(tmp[1])
        IDImages[1] = tmp[1];
    }
    return (
      <div className="form-group">
        <label className="control-label col-xs-3" style={style.label}>身份证正反面：</label>
        <div className="col-xs-9">
          <div className="row" style={style.imgId}>
            <ImageInput width="200"
              height="150"
              addStyle={{width:220}}
              defaultImage={IDImages[0]}
              onUpload={this.upload1}
              onError={this.props.showMessage}
              disabled={this.props.disabled}
              multi_selection={false}
              uid="IDPicture1"
              ref="IDPicture1"
              type="user"/>
            <ImageInput width="200"
              height="150"
              addStyle={{width:220}}
              defaultImage={IDImages[1]}
              onUpload={this.upload2}
              onError={this.props.showMessage}
              disabled={this.props.disabled}
              multi_selection={false}
              uid="IDPicture2"
              ref="IDPicture2"
              type="user"/>
          </div>

          <div className="row">
            <div className="col-xs-4">
              <img height="150" width="200" src="img/id_shili.png" />
            </div>
            <div className="col-xs-8">
              <div style={style.info}>
                1 正反面带头像的清晰照片<br />
                2 仅用于认证请放心上传
              </div>
            </div>
          </div>
        </div>
      </div>
      );
  }
});

var AuthRealName = React.createClass({
  getInitialState: function(){
    return {
      authState : '0',
      disabled : false,
      pAuthData : {}
    }
  },
  updateIDImage1 : function(result){
    var IDImages = [];
    if(this.state.pAuthData.IdNumberImages){
      IDImages = this.state.pAuthData.IdNumberImages.split(',');
      IDImages[0] = result;
    }else{
      IDImages[0] = result;
      IDImages[1] = '';
    }
    var data = this.state.pAuthData;
    data.IdNumberImages = IDImages.toString();
    this.setState({pAuthData : data});
  },
  updateIDImage2 : function(result){
    var IDImages = [];
    if(this.state.pAuthData.IdNumberImages){
      IDImages = this.state.pAuthData.IdNumberImages.split(',');
      IDImages[1] = result;
    }else{
      IDImages[0] = '';
      IDImages[1] = result;
    }
    var data = this.state.pAuthData;
    data.IdNumberImages = IDImages.toString();
    this.setState({pAuthData : data});
  },
  showMessage : function(message) {
    this.refs.toolTip.toShow(message);
  },
  render: function() {
    return (
      <div>
        <PersonIDImage ref = "personIDImage"
          value = {this.state.pAuthData.IdNumberImages}
          upload1 = {this.updateIDImage1}
          upload2 = {this.updateIDImage2}
          showMessage = {this.showMessage}
          disabled = {this.state.disabled}
        />
        <Link to="/account/pAuth/submitaudit">下一步</Link>
        <ToolTip ref="toolTip" title=""/>
      </div>
    );
  },
});

module.exports = AuthRealName;
