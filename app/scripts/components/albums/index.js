var React = require('react');
var Reflux = require('reflux');
var Header = require('./../header');
var ComponentGallery = require('react-component-gallery');
var AlbumsActions = require('../../actions/AlbumsActions');
var AlbumsStore = require('../../stores/AlbumsStore');

var Albums = React.createClass({
    mixins : [Reflux.listenTo(AlbumsStore,'onStoreChanged')],
    getInitialState : function(){
        return {
            work :null
        }
    },
    onStoreChanged : function(data){
        if(data.hintMessage){
            console.log(data.hintMessage);
        }else{
            console.log("aaa="+JSON.stringify(data))
            this.setState({work : data.workData});
        }
    },
    componentDidMount: function() {
        var id = this.props.params.id;
        console.log("id="+id)
        var data ={
            Fields : 'Id,Title,UserId,CategoryId,CreationTime,EditingTime,Display,Description,Cover,Photos.Id,Photos.Url',
            Id : id,
        };
        AlbumsActions.get(data)
    },
    render: function() {
        var photoList = <div></div>
        if(this.state.work){
            var photoList = this.state.work.Photos.map(function(photo,i){
                return (
                    <div key={i}>
                        <span>删除</span>
                        <span>设置封面</span>
                        <span>上</span>
                        <span>下</span>
                        <img key={photo.Id} src={photo.Url} />
                    </div>
                );
            }.bind(this));
        }
        return (
        <div className="container-fluid no-bgimg gray-bg">
            <Header />
            <div style={{marginTop:100}}>
                <ComponentGallery
                    className="photos"
                    margin={10}
                    noMarginBottomOnLastRow={true}
                    widthHeightRatio={4/5}
                    targetWidth={250}>
                    {photoList}
                </ComponentGallery>
            </div>
        </div>
        );
    }
});

module.exports = Albums;
