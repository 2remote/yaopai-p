import React from 'react'
import UserBasicInfoForm from './UserBasicInfoForm'

const UserInfoPanel = React.createClass({
  render() {
    return (
      <div>
        <UserBasicInfoForm avatar="avatarUrl" />
      </div>
    )
  },
})

export default UserInfoPanel
