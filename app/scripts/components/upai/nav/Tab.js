import React, { PropTypes } from 'react'
import { Link, RouterContext } from 'react-router'

const Tab = React.createClass({
  render() {
    const { items } = this.props
    return (
      <ul className="nav nav-tabs">
        {
          items.map(item => (
            <li>
              <Link to={item.url}>{item.text}</Link>
            </li>
          ))
        }
      </ul>
    )
  },
})

Tab.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string,
    url: PropTypes.string,
  }))
}

export default Tab
