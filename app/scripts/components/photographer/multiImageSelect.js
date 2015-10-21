var React = require('react');
var ImageInput = require('../account/imageInput');

var MultiImageSelect = React.createClass({
  getDefaultProps : function(){
    return {
      updateImages : function(result){},
      labelName : '',
      images : [],
      uid : 'multiImageSelect',
      width: '150px',
      height: '150px',
      maxCount : 4,
    }
  },
  getInitialState: function () {
    return {
    }
  },
  componentDidMount : function() {
  },
  onUpload : function(imageUrl){
    this.props.updateImages(imageUrl);
    //this.refs.addImage.setState({imageUrl : ''}); //清空图片
  },
  onRemove : function(event){
    var index = event.target.getAttribute('data-index');
    this.props.remove(index);
  },
  handleEnd: function (e) {
    //---除了DOM操作也没有更好办法，或者DOM操作写法是不是这样
    var mask = e.currentTarget.querySelector('.mask');
    mask.style.display = 'block';
  },
  hanldeLeave: function (e) {
    var mask = e.currentTarget.querySelector('.mask');
    mask.style.display = 'none';
  },
  parseImageUrl :function(url){
    url = url + '?imageMogr2/gravity/Center'
    if(this.props.width && this.props.height){
      url = url + '/thumbnail/!'+this.props.width+'x'+this.props.height+'r'; //限制短边
      url = url + '/crop/'+this.props.width + 'x' + this.props.height; //剪裁
    }
    if(this.props.width && !this.props.height){
      url = url + '/thumbnail/'+this.props.width+'x'; //只缩放宽度,不剪裁
    }
    if(this.props.height && !this.props.width){
      url = url + '/thumbnail/x'+this.props.height; //只缩放高度,不剪裁
    }
    url = url + '/interface/1'; //渐进
    return url;
  },
  render : function(){
    var style = {
      worksWrap: {
        position: 'relative',
        width: '100px',
        height: '100px',
        display: 'inline-block',
        verticalAlign: 'top',
        marginRight: '5px',
        marginBottom: '5px',
      },
      mask: {
        position: 'absolute',
        left: '0',
        top: '0',
        width: '100px',
        height: '100px',
        background: 'rgba(0,0,0,.1)',
        lineHeight: '100px',
        textAlign: 'center',
        fontSize: '18px',
        cursor: 'pointer',
        display: 'none',
        color: '#fff',
        transition: '1s',
      },
      addImg: {
        display: 'inline-block',
        verticalAlign: 'top',
        width: '100px',
        height: '100px',
      },
      addImgHide: {
        display: 'none',
      },
      label: {
        lineHeight: '100px',
      }
    }
    var renderImages ='';
    var canAddImage = true;
    if(this.props.images && this.props.images.length >0){
      var images = this.props.images.split(',');
      if(images.length >= this.props.maxCount){
        canAddImage = false;
      }else{
        canAddImage = true;
      }
      renderImages = images.map(function(image,i){
        return (
          <div key={i} onMouseEnter={this.handleEnd} onMouseLeave={this.hanldeLeave} style={style.worksWrap}>
            <img width="100" height="100" src={this.parseImageUrl(image)} />
            <div ref="mask" className="mask" style={style.mask}><span ref="delete" data-index={i} onClick={this.onRemove}>删除</span></div>
          </div>
        )
      }.bind(this));
    }
    if(this.props.disabled) canAddImage = false;
    return (
      <div className="form-group">
        <label className="control-label col-xs-2" style={style.label}>{this.props.labelName}</label>
          <div className="col-xs-10">
          {renderImages}
          <ImageInput
            addStyle={canAddImage?style.addImg:style.addImgHide}
            colWidth=""
            width={this.props.width}
            height={this.props.height}
            uid={this.props.uid}
            ref="addImage"
            defaultImage="img/tianjia.png"
            onUpload={this.onUpload}/>
        </div>
      </div>
      )
  }
});

module.exports = MultiImageSelect;