import React, { PropTypes } from 'react'

import InputGroup from '../components/upai/form/InputGroup'

const MakeupArtistInfoForm = React.createClass({
  render() {
    const { onSubmit } = this.props
    return (
      <form onSubmit={onSubmit}>
        <InputGroup
          label="label1"
          type="text"
          horizontalLabelStyle="col-xs-3"
          horizontalInputStyle="col-xs-6"
          updateValue={(value) => console.log('value', value)}
        />
        <button className="btn btn-primary" type="submit">保存</button>
      </form>
    )
  },
})

MakeupArtistInfoForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}


/* ---------------------------------------------------------------- */

const MakeupArtistInfoFormContainer = React.createClass({
  onSubmit(e) {
    e && e.preventDefault && e.preventDefault()
  },
  render() {
    return (
      <MakeupArtistInfoForm
        onSubmit={this.onSubmit}
      />
    )
  },
})

export default MakeupArtistInfoFormContainer
