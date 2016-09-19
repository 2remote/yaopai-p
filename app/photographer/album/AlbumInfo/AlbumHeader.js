import React from 'react'
import { ALBUM_DISPLAY_ON, ALBUM_DISPLAY_OFF, ALBUM_DISPLAY_ALL } from './constant'

/**
 * 头部header，用于展示“已上架作品”和“未上架作品”的按钮
 * Props:
 *   display: 当前作品展示的过滤条件
 *   changeDisplayFIlter: 修改当前展示作品过滤条件的方法
**/
const AlbumHeader = React.createClass({
  render: function() {
    return (
      <div className="row" style={{ paddingBottom: 15, marginBottom: 15, borderBottom: '1px solid #F6F6F6' }}>
        <div className="col-xs-6 text-right" style={{ borderRight: '1px solid #F6F6F6' }}>
          <a
            className={ this.props.display === ALBUM_DISPLAY_ON ? 'active' : 'inactive' }
            onClick={ () => this.props.changeDisplayFilter(ALBUM_DISPLAY_ON) }
          >
            已上架作品
          </a>
        </div>
        <div className="col-xs-6 text-left">
          <a
            className={ this.props.display === ALBUM_DISPLAY_OFF ? 'active' : 'inactive' }
            onClick={ () => this.props.changeDisplayFilter(ALBUM_DISPLAY_OFF) }
          >
            未上架作品
          </a>
        </div>
      </div>
    )
  },
})

export default AlbumHeader
