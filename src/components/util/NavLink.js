import React from 'react'
import { Link } from '@reach/router'

const NavLink = props => {
  const classes = 'nav-link nav-item'
  return (
    <Link
      {...props}
      className={classes}
      getProps={linkProps => {
        if (linkProps.isPartiallyCurrent)
          return {
            className: classes + ' active'
          }
      }}
    />
  )
}

export default NavLink
