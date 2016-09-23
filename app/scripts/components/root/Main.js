var React = require('react');
var { Link, History } = require('react-router');
import { ROUTE_ROOT } from 'util/routeConfig'

const Main = React.createClass({
  mixins: [History],
  render: function() {
    return (
      <div>
        <div className="row" style={{ borderBottom: '1px solid #f6f6f6' }}>
          <div className="col-xs-6 text-right" style={{ borderRight: '1px solid #f6f6f6' }}>
            <Link to={ ROUTE_ROOT } params={{ shelve: true }}>已上架作品</Link>
          </div>
          <div className="col-xs-6">
            <Link to={ ROUTE_ROOT } params={{ shelve: false }}>未上架作品</Link>
          </div>
          <div className="col-xs-12" style={{ height: 2 }}></div>
        </div>
      </div>
    );
  },
});

module.exports = Main;
