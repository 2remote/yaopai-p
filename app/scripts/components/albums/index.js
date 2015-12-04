var React = require('react');
var Header = require('../header');
var ComponentGallery = require('react-component-gallery');

var Albums = React.createClass({
    render: function() {
        return (
          <div>
            <Header />
            <ComponentGallery
              className="photos"
              margin={10}
              widthHeightRatio={3/5}
              targetWidth={250}>
              <img src="https://example.com/pic1.jpg" />
              <img src="https://example.com/pic2.jpg" />
              <img src="https://example.com/pic3.jpg" />
              <img src="https://example.com/pic4.jpg" />
              <img src="https://example.com/pic5.jpg" />
              <img src="https://example.com/pic6.jpg" />
            </ComponentGallery>
          </div>
        );
    }
});

module.exports = Albums;
