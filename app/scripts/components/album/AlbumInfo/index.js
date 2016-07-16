import React from 'react'
import Reflux from 'reflux'

import UserAccountStore from '../../../stores/UserAccountStore'
import AlbumList from './AlbumList'
import AlbumHeader from './AlbumHeader'
import { ALBUM_DISPLAY_ON } from './constant'

/**
 * 作品信息
 * State:
 *   userInfo: 通过Reflux的connect获取。其实是为了获取用户ID，然后交给作品列表去获取作品
 *   display: 作品展示的过滤条件
**/
var AlbumInfo = React.createClass({
  mixins: [
    Reflux.connect(UserAccountStore, 'userInfo')
  ],
  getInitialState: function() {
    return {
      /* 作品列表默认显示上架作品 */
      display: ALBUM_DISPLAY_ON,
    };
  },
  changeDisplayFilter: function(newDisplayFilter) {
    this.setState({
      display: newDisplayFilter,
    });
  },
  render: function() {
    return (
      <div className="panel-body">
        <AlbumHeader
          display={ this.state.display }
          changeDisplayFilter={ this.changeDisplayFilter }
        />
        <AlbumList
          display={ this.state.display }
          userId={ this.state.userInfo.basic.id }
          pageIndex = { this.state.pageIndex }
        />
      </div>
    );
  },
});

export default AlbumInfo
