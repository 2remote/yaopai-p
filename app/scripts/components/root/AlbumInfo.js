import React from 'react'
import Reflux from 'reflux'
import QRCode from 'qrcode.react'
import _ from 'lodash'

import NoData from '../noData'

import UserPanel from './UserPanel'
/* Why be you when you can be NEW */
var AlbumAction = require('../../actions/AlbumAction');
var UserAccountStore = require('../../stores/UserAccountStore');
var { AlbumStore, ALBUM_NOT_FETCHED } = require('../../stores/AlbumStore');
import AlbumList from './AlbumList'
import MainHeader from './MainHeader'
import { ALBUM_DISPLAY_ON, ALBUM_DISPLAY_OFF, ALBUM_DISPLAY_ALL } from './MainConstant'

/**
 * 作品信息(这名字怎么这么邪)
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
      /* 作品列表显示内容过滤 */
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
        <MainHeader
          display={ this.state.display }
          changeDisplayFilter={ this.changeDisplayFilter }
        />
        <AlbumList
          display={ this.state.display }
          userId={ this.state.userInfo.basic.id }
          pageIndex = {this.state.pageIndex}
        />
      </div>
    );
  },
});

export default AlbumInfo
