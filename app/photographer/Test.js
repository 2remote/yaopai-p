import React from 'react'
import PGInfoAction from 'photographer/actions/PGInfoAction'

class Test extends React.Component {
  componentDidMount() {
    PGInfoAction.fetch(0, true)
  }

  render() {
    return (
      <div>Test</div>
    )
  }
}

export default Test
