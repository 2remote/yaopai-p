import React from 'react'
import Reflux from 'reflux'
import { Link } from 'react-router'
import { AlbumStore, ALBUM_NOT_FETCHED } from '../../../stores/AlbumStore'
import AlbumAction from '../../../actions/AlbumAction'
var MasonryMixin = require('react-masonry-mixin')(React)
import { ALBUM_DISPLAY_ON, ALBUM_DISPLAY_OFF, ALBUM_DISPLAY_ALL } from './constant'
import NoData from '../../noData'

/*
瀑布流布局配置参数
*/
const masonryOptions = {
  transitionDuration: '0s',
  gutter: 15,
  isFitWidth: true,
}

/**
 * AlbumList用来(按需)展示作品列表
 * State:
 *   album: 通过Reflux的connect获取作品列表数据
 * Props:
 *   userId: 用户Id
 *   display: 作品展示过滤条件
**/
const AlbumList = React.createClass({
  mixins: [
    Reflux.connect(AlbumStore, 'album'),
    MasonryMixin('masonryContainer', masonryOptions)
  ],
  /**
   * 利用上层传来的用户id来触发作品全列表的获取
  **/
  componentWillReceiveProps: function(nextProps) {
    const userId = nextProps.userId
    // 仅在用户Id获取到且作品列表未获取时触发
    if(userId && this.state.album.status === ALBUM_NOT_FETCHED) {
      AlbumAction.fetch(userId)
    }
  },
  componentDidMount() {
    const userId = this.props.userId
    if(userId){
      AlbumAction.fetch(userId)
    }
  },
  moveAlbum: function(albumId, step) {
    let { onSaleList, offSaleList } = this.state.album
    let targetList
    let targetIndex = -1
    let resultList = []
    targetList = onSaleList.concat(undefined).concat(offSaleList)
    if(!targetList || targetList.length === 0) { // awdw
      return
    }
    targetList = targetList.map((album, index) => {
      if(!album) { // the one concatenated from above
        return undefined
      }
      if(album.id === albumId) {
        targetIndex = index
      }
      return album.id
    })
    // 遍历targetList，做排序调整
    // 增加-1和length处的值（js下是undefined），少写一些if else判断
    for(let count = -1; count <= targetList.length; count++) {
      let theIndex
      if(count === targetIndex) {
        theIndex = targetIndex + step
      } else if(count === targetIndex + step) {
        theIndex = targetIndex
      } else {
        theIndex = count
      }
      if(typeof targetList[theIndex] != 'undefined') {
        resultList.push(targetList[theIndex])
      }
    }
    // console.log(resultList)
    AlbumAction.sort(resultList.toString())
  },
  onImgError: function (obj) {
    obj.target.src = "../../../img/loaderror.png"
  },
  workState : function(state){
    switch (state){
      case 0 :
        return {style:{background:'#FFAB1F',color:'#fff'},state:'未审核'}
      case 1 :
        return {style:{background:'#38BC59',color:'#fff'},state:'审核成功'}
      case 2 :
        return {style:{background:'#D4482E',color:'#fff'},state:'审核失败'}
    }
  },
  render: function() {
    let self = this
    let albumInfo = ''
    const display = self.props.display
    let list // 作品列表
    let noDataMsg = '' // 列表为空的时候的message
    if(display === ALBUM_DISPLAY_ON) { // 上架作品
      list = self.state.album.onSaleList
      noDataMsg = '您还没有作品，快去上传或上架吧！'
    } else if(display === ALBUM_DISPLAY_OFF) { // 下架作品
      list = self.state.album.offSaleList
      noDataMsg = '暂无未上架作品'
    } else if(display === ALBUM_DISPLAY_ALL) { // 全部作品
      list = self.state.album.onSaleList.concat(self.state.album.offSaleList)
      noDataMsg = '您还没有作品，快去上传吧！'
    } else { // unknown filter
      list = []
    }

    if(list && list.length > 0) {
      albumInfo = list.map((work, index) => (

          <div key={ index } style={{ border: '1px solid #efefef', marginBottom: 15, position: 'relative' }}>
            <span className="albumList-state" style={self.workState(work.state).style}>{self.workState(work.state).state}</span>
            <Link to={ '/albums/' + work.id }>
              <img width='300' height='200' src={ work.cover + '?imageView2/2/w/300/interlace/1' } onError={ self.onImgError }/>
            </Link>


            <div className="albumList-group">
              <a className="albumList-left" onClick={ e => self.moveAlbum(work.id, -1) }>前移</a>
              <a className="albumList-right" onClick={ e => self.moveAlbum(work.id, 1) }>后移</a>
            </div>
            <p style={{
            textAlign:'left',
            color:'#000',
            lineHeight:'30px',
            margin:'0px',
            padding:'0 10px',
            overflow:'hidden',
            width:'300px',
            height:'30px'
            }}>
              {work.title}
            </p>
          </div>
      ))
    } else {
      albumInfo = <div style={{padding:'100px 0'}}>{ noDataMsg }</div>
    }
    return (
      <div className="row">
        <div ref="masonryContainer" className="center-block">
          { albumInfo }
        </div>
      </div>
    )
  }
})

export default AlbumList
