/**
 * 用户基本信息修改的表单
 *
 * @since 2016-08-20
**/

import React, { PropTypes } from 'react'

const UserBasicInfoForm = React.createClass({
  render() {
    const { avatar } = this.props
    return (
      <div>
        {avatar}
        UserBasicInfoForm
      </div>
    )
  },
})

UserBasicInfoForm.propTypes = {
  avatar: PropTypes.string,
}

export default UserBasicInfoForm
