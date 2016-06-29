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
          hairColor: info.hairColor, // 发色
          pupil: info.pupil, // 瞳色
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
          <TextInput labelName="鞋码(这里需要一个单位)"
            type='number'
            value={ ui.shoeSize } updateValue={ val => this.updateUI('shoeSize', val) }
            placeholder=""
          />
          <hr />
          <TextInput labelName="发色：开发中"
            type='number'
            value={ ui.hairColor.text } updateValue={ val => this.updateUI('hairColor', val) }
            disabled={ true }
            placeholder=""
          />
          <TextInput labelName="瞳色：开发中"
            type='number'
            value={ ui.pupil.text } updateValue={ val => this.updateUI('pupil', val) }
            disabled={ true }
            placeholder=""
          />
        <button type="submit" className="btn btn-primary">保存</button>
        </form>
      </div>
    )
  }
})

export default MoteInfo
