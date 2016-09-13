/**
 * 模特信息录入界面
 * TODO: 优化成stateless组件
 *
 * @since 2016-08-22
**/
import React from 'react'
import Reflux from 'reflux'
/* reusable components */
import InputGroup from '../components/upai/form/InputGroup'
/* store and action */
import MoteStore from './MoteStore'
import MoteAction from './MoteAction'
import ToolTip from '../components/toolTip';

const MoteInfo = React.createClass({
  mixins: [Reflux.connect(MoteStore, 'info')],
  getInitialState: function() {
    return {
      ui: {
        pristine: true,
        hairColor: {},
        pupil: {},
      },
    }
  },
  // state更新后就会调用
  shouldComponentUpdate: function(nextProps, nextState) {
    this.initUI(nextState)
    return true // means please re-render
  },
  componentWillMount: function() {
    this.initUI(this.state)
  },
  initUI: function(whichState) {
    const { info, ui } = whichState
    // 如果store里的数据来自服务器 && 本地用户还没开始修改数据
    if(!info.pristine && ui.pristine) {
      this.setState({
        ui: {
          pristine: false,
          height: info.height, // 身高
          weight: info.weight, // 体重
          bust: info.bust, // 胸围
          waist: info.waist, // 腰围
          hip: info.hip, // 臀围
          shoeSize: info.shoeSize, // 鞋码
          hairColor: info.hairColor.code, // 发色
          pupil: info.pupil.code, // 瞳色
        },
      })
    }
  },
  updateUI: function(key, value) {
    const oldUI = this.state.ui
    let ui = {
      pristine: false,
      height: oldUI.height, // 身高
      weight: oldUI.weight, // 体重
      bust: oldUI.bust, // 胸围
      waist: oldUI.waist, // 腰围
      hip: oldUI.hip, // 臀围
      shoeSize: oldUI.shoeSize, // 鞋码
      hairColor: oldUI.hairColor, // 发色
      pupil: oldUI.pupil, // 瞳色
    }
    ui[key] = value
    this.setState({ ui })
  },
  onSubmit: function(e) {
    e.preventDefault()
    MoteAction.changeInfo(this.state.ui)
    this.showMessage("信息修改成功")
  },
  showMessage: function (message) {
    this.refs.toolTip.toShow(message)
  },
  render: function() {
    let { ui } = this.state
    return (
      <div className="container-fluid">
        <form className="form-horizontal" onSubmit={ this.onSubmit }>
          <InputGroup
            type='number' label="身高(cm)"
            horizontalLabelStyle="col-xs-3" horizontalInputStyle="col-xs-5"
            value={ ui.height } updateValue={ val => this.updateUI('height', val) }
            placeholder=""
          />
          <InputGroup
            type='number' label="体重(kg)"
            horizontalLabelStyle="col-xs-3" horizontalInputStyle="col-xs-5"
            value={ ui.weight } updateValue={ val => this.updateUI('weight', val) }
            placeholder=""
          />
          <InputGroup
            type='number' label="胸围(cm)"
            horizontalLabelStyle="col-xs-3" horizontalInputStyle="col-xs-5"
            value={ ui.bust } updateValue={ val => this.updateUI('bust', val) }
            placeholder=""
          />
          <InputGroup
            type='number' label="腰围(cm)"
            horizontalLabelStyle="col-xs-3" horizontalInputStyle="col-xs-5"
            value={ ui.waist } updateValue={ val => this.updateUI('waist', val) }
            placeholder=""
          />
          <InputGroup
            type='number' label="臀围(cm)"
            horizontalLabelStyle="col-xs-3" horizontalInputStyle="col-xs-5"
            value={ ui.hip } updateValue={ val => this.updateUI('hip', val) }
            placeholder=""
          />
          <InputGroup
            type='number' label="鞋码(码)"
            horizontalLabelStyle="col-xs-3" horizontalInputStyle="col-xs-5"
            value={ ui.shoeSize } updateValue={ val => this.updateUI('shoeSize', val) }
            placeholder="如女鞋 38 码直接输入数字 38 即可"
          />
          <hr />
          <div className="form-group">
            <label className="col-sm-3 control-label">发色</label>
            <div className="col-sm-5">
              <select className="form-control"
                value={ ui.hairColor }
                onChange={ e => this.updateUI('hairColor', e.target.value) }
              >
                <option value="None">---请选择发色---</option>
                <option value="Black">黑色</option>
                <option value="Brown">棕色</option>
                <option value="Blond">金黄色</option>
                <option value="Red">红色</option>
                <option value="White">白色</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="col-sm-3 control-label">瞳色</label>
            <div className="col-sm-5">
              <select className="form-control"
                value={ ui.pupil }
                onChange={ e =>  this.updateUI('pupil', e.target.value) }
              >
                <option value="None">---请选择瞳色---</option>
                <option value="Black">黑色</option>
                <option value="Brown">棕色</option>
                <option value="Blue">蓝色</option>
                <option value="Gray">灰色</option>
                <option value="Green">绿色</option>
              </select>
            </div>
          </div>
        <button type="submit" className="btn btn-primary">保存</button>
        </form>
        <ToolTip ref="toolTip" title=""/>
      </div>
    )
  }
})

/* -------------------------------- */

const MoteInfoContainer = React.createClass({
  render() {
    return (
      <MoteInfo />
    )
  },
})

export default MoteInfoContainer
