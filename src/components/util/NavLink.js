import React from 'react'
import { Link } from '@reach/router'

const NavLink = props => {
  const classes = 'nav-link nav-item'
  return (
    <Link
      {...props}
      className={classes}
      getProps={linkProps => {
        if (
          linkProps.isPartiallyCurrent ||
          linkProps.location.pathname.startsWith(props.root)
        )
          return {
            className: classes + ' active'
          }
      }}
    />
  )
}

export default NavLink
