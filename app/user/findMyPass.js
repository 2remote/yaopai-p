import React from 'react'
import { History } from 'react-router'
import Reflux from 'reflux'
import InputGroup from '../scripts/components/upai/form/InputGroup'


const FindMyPass = React.createClass({
  mixins: [],

  render() {
    const panelStyle = {
      width: '100%',
      height: '100%',
      position: 'fixed',
      background: 'rgba(255,255,255,.8)',
    }

    return (
      <section style={ panelStyle }>
        <form className="form-horizontal" onSubmit={this.props.handleSubmit}>

          {/* 一、title 标题 */}
          <InputGroup
            label="标题"
            type="text"
            horizontalLabelStyle="col-xs-3"
            horizontalInputStyle="col-xs-6"
            value={this.props.title}
            updateValue={this.props.updateTitle}
            placeholder="2到30个字"
            hasFeedback
            minLength={2}
            maxLength={30}
          />

        </form>
      </section>
    )
  },
})

export default FindMyPass