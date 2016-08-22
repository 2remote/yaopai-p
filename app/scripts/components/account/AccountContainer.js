import React from 'react'

import Tab from '../upai/nav/Tab'

const AccountContainer = React.createClass({
  render: function() {
    const tabItems = [{
      text: 'hehe',
      url: 'hehe',
    }, {
      text: 'hehe2',
      url: 'hehe2',
    }]
    return (
      <div className="panel-body">
        <Tab items={tabItems} />
        { this.props.children }
      </div>
    )
  },
})

export default AccountContainer
