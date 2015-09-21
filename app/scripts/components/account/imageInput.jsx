var React = require ('react');

var ImageInput = React.createClass({

  getInitialState : function(){
    return {
      imageUrl : ''
    }
  },
  getDefaultProps : function(){
    return {
      defaultImage : 'img/tianjia.png'
    }
  },
  componentDidMount : function() {
    this.reader = new FileReader()
    this.reader.onload = this.fileLoaded
  },
  /*
    读取成功后加载Image
  */
  fileLoaded : function(event) {
    this.setState({imageUrl : event.target.result});
  },
  selectImage : function(event){
    if(event.target.files && event.target.files[0]) {
      //this.setState({ loading: true, fileURL: null })
      this.reader.readAsDataURL(event.target.files[0])
    }
  },
  handleClick : function(){
    React.findDOMNode(this.refs.imageFile).click();
  },
  showImage : function(){
    return;
  },
  render : function (){
    var img ;
    if(this.state.imageUrl != ''){
      img = (
        <img className="image-button" width="150" heigth="150" src={this.state.imageUrl} onClick={this.showImage} />
      );
    }else{
      img = (
        <img className="image-button" width="150" heigth="150" src={this.props.defaultImage} onClick={this.handleClick} />
      );
    }

    return (
      <div className="col-xs-4">
        <div>
          {img}
          <input type="file" ref="imageFile" className="hidden" onChange={this.selectImage} />
        </div>
      </div>
    );
  }
});

module.exports = ImageInput;