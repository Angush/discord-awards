import React, { useState, useEffect } from 'react'
import { Container, Navbar, Nav } from 'react-bootstrap'
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

  const matchedNavLink = navlinks.filter(n => n.to === location.pathname)
  const navClass =
    matchedNavLink[0] && matchedNavLink[0].navClass
      ? matchedNavLink[0].navClass
      : ''

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
          <Navbar.Brand>Cauldron Awards</Navbar.Brand>
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
                <a
                  id='login'
                  className='logInOrOut'
                  href={`https://cauldron2019.wormfic.net/login`}
                >
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
