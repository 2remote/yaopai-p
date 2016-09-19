import React from 'react'
import Reflux from 'reflux'
import PGInfoAction from 'photographer/actions/PGInfoAction'
import PGInfoStore from 'photographer/stores/PGInfoStore'


const Test = React.createClass({
  mixins: [Reflux.connect(PGInfoStore, 'pgInfo')],

  componentDidMount() {
    PGInfoAction.fetch(0, true)
  },

  render() {
    return (
      <div>Test</div>
    )
  },
})

export default Test
