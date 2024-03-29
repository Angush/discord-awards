import React, { useState, useEffect } from 'react'
import { Container, Navbar, Nav } from 'react-bootstrap'
import getLoginPathName from '../../functions/getLoginPathName'
import NavLink from './NavLink'

const AppNavBar = ({ navlinks, userData, logout, location }) => {
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    window.addEventListener('click', event => {
      // close nav bar if user clicks outside of it
      const classes = event.target.classList
      if (
        classes.contains('nav-overlay') &&
        classes.contains('active-overlay')
      ) {
        event.preventDefault()
        setExpanded(false)
      }
    })
  }, [])

  const getNavClass = link => {
    let c = link.navClass || ''
    if (!link.classOn) return c
    if (link.classOn.root && link.to === location.pathname) return c
    if (
      link.classOn.children &&
      location.pathname.startsWith(link.root) &&
      link.to !== location.pathname
    )
      return c
  }

  const matchedNavLink = navlinks.filter(
    l => l.to === location.pathname || location.pathname.startsWith(l.root)
  )
  const navClass = matchedNavLink[0] && getNavClass(matchedNavLink[0])

  return (
    <>
      <Navbar
        className={navClass + (expanded ? ' expanded' : '')}
        expanded={expanded}
        variant='dark'
        expand='md'
        fixed='top'
        bg='dark'
      >
        <Container>
          <img
            width='39'
            height='50'
            src='/images/awards-gold-badge.svg'
            alt=''
          />
          <Navbar.Brand>
            <a href='/'>Cauldron Awards</a>
          </Navbar.Brand>
          <Navbar.Toggle onClick={() => setExpanded(expanded ? false : true)} />
          <Navbar.Collapse>
            <Nav>
              {navlinks.map((link, index) => (
                <NavLink
                  key={index}
                  to={link.to}
                  root={link.root}
                  onClick={() => setExpanded(false)}
                >
                  {link.text}
                </NavLink>
              ))}
            </Nav>
            <div id='user' onClick={logout}>
              {userData.user ? (
                <>
                  <img
                    src={userData.user.avatar}
                    alt={`${userData.user.username}'s avatar`}
                    loading='lazy'
                    height='32px'
                    width='32px'
                    id='avatar'
                  />
                  <div id='userData'>
                    {userData.user.username}
                    <span id='discriminator'>
                      #{userData.user.discriminator}
                    </span>
                  </div>
                  <div id='logout' className='logInOrOut'>
                    <img src='/images/logout.svg' alt='Logout' />
                  </div>
                </>
              ) : (
                <a id='login' className='logInOrOut' href={getLoginPathName()}>
                  <span>Login</span>
                  <img
                    src='/images/discord_logo.svg'
                    style={{ marginLeft: '8px' }}
                    alt='Login with Discord'
                  />
                </a>
              )}
            </div>
            <div id='user-backfill'></div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div
        className={'nav-overlay' + (expanded ? ' active-overlay' : '')}
      ></div>
    </>
  )
}

export default AppNavBar
