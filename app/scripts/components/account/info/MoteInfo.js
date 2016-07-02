import React from 'react'
import Reflux from 'reflux'
import _ from 'lodash'
/* reusable components */
import InfoHeader from '../../infoHeader'
import TextInput from '../textInput'
/* store and action */
import MoteStore from '../../../stores/professional/MoteStore'
import MoteAction from '../../../actions/professional/MoteAction'

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
  },
  render: function() {
    let { ui } = this.state
    return (
      <div className="container-fluid">
        <InfoHeader infoTitle="模特信息补填" infoIconClass="glyphicon glyphicon-user"/>
        <form className="form-horizontal" onSubmit={ this.onSubmit }>
          <TextInput labelName="身高(cm)"
            type='number'
            value={ ui.height } updateValue={ val => this.updateUI('height', val) }
            placeholder=""
          />
          <TextInput labelName="体重(kg)"
            type='number'
            value={ ui.weight } updateValue={ val => this.updateUI('weight', val) }
            placeholder=""
          />
          <TextInput labelName="胸围(cm)"
            type='number'
            value={ ui.bust } updateValue={ val => this.updateUI('bust', val) }
            placeholder=""
          />
          <TextInput labelName="腰围(cm)"
            type='number'
            value={ ui.waist } updateValue={ val => this.updateUI('waist', val) }
            placeholder=""
          />
          <TextInput labelName="臀围(cm)"
            type='number'
            value={ ui.hip } updateValue={ val => this.updateUI('hip', val) }
            placeholder=""
          />
          <TextInput labelName="鞋码(码)"
            type='number'
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
      </div>
    )
  }
})

export default MoteInfo
