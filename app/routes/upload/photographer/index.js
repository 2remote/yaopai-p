import React from 'react'

import MoteUpload from '../../../photographer/album/PGAlbumUpload'

const PhotographerUploadRouteComponent = React.createClass({
  render() {
    return (
      <div className="panel-body">
        {/* TODO: 这里需要一个heading，以后考虑重构到panel-heading上 */}
        <MoteUpload />
      </div>
    )
  },
})

export default PhotographerUploadRouteComponent
