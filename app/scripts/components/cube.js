var React = require('react');

var Cube = React.createClass({
  render : function(){
    return (
      <section className="cube-container">
        <div id="cube">
          <figure className="show-front">{this.props.content[0]}</figure>
          <figure className="show-back">{this.props.content[1]}</figure>
          <figure className="show-right">{this.props.content[2]}</figure>
          <figure className="show-left">{this.props.content[3]}</figure>
          <figure className="show-top">{this.props.content[4]}</figure>
          <figure className="show-bottom">{this.props.content[5]}</figure>
        </div>
      </section>
    )
  }
});

module.exports = Cube;