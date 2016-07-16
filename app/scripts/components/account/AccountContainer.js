import React from 'react'

const AccountContainer = React.createClass({
  render: function() {
    return (
      <div className="panel-body">
        { this.props.children }
      </div>
    )
  },
})

export default AccountContainer
