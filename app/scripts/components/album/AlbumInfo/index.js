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
        <div className="tip_album">
          <h4> 温馨提示：</h4>

          <span style={{color:'#000'}}>已上架作品</span>：由摄影师自己设置的对外公开的作品，用户可通过审核成功的已上架作品进行预约拍摄。<br/>
          <span style={{color:'#000'}}>未上架作品</span>：由摄影师自己设置的对外不公开的作品。<br/>
          <span style={{color:'#000'}}>未审核</span>：YAOPAI 平台作品上传采取「先发后审」 的审核机制，「未审核」的上架作品也可以对外公开展示。<br/>
          <span style={{color:'#000'}}>审核成功</span>：「审核成功」的上架作品也可以对外公开展示。<br/>
          <span style={{color:'#000'}}>审核失败</span>：作品审核失败的原因一般为：<br/>
          1、作品名称、简述、补充说明或者作品图片上有明显的个人联系方式；<br/>
          2、作品质量不合格。<br/>
          「审核失败」的作品无论上架或下架都不会对外公开展示，按要求重新修改作品提交审核可再次对外公开展示。<br/>
        </div>
      </div>
    );
  },
});

export default AlbumInfo
