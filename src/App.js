import React, { useState, useEffect } from 'react'
import { Router, Redirect } from '@reach/router'
import { Container, Navbar, Nav } from 'react-bootstrap'
import NavLink from './components/util/NavLink'

// router pages
import NotFoundPage from './pages/NotFoundPage'
import NominationPage from './pages/NominationPage'
import MyNomineesPage from './pages/MyNomineesPage'
import VotePage from './pages/VotePage'

// css sheets
import './style/bootstrap.min.css'
import './style/App.css'

const App = () => {
  const [userinfo, setUserinfo] = useState({})
  const [expanded, setExpanded] = useState(false)
  const [navlinks] = useState([
    {
      text: 'Vote',
      to: '/vote'
    },
    {
      text: 'My Nominees',
      to: '/nominees'
    }
  ])

  useEffect(() => {
    window.addEventListener('click', handleClick)
    window.addEventListener('keydown', handleKeydown)

    let cached = localStorage.userinfo
    if (cached)
      try {
        setUserinfo(JSON.parse(cached))
      } catch (e) {}

    window
      .fetch(`https://cauldron2019.wormfic.net/api/auth`, {
        credentials: 'include'
      })
      .then(response => response.json())
      .then(data => {
        setUserinfo(data)
        let stringified = JSON.stringify(data)
        localStorage.userinfo = stringified
      })
  }, [])

  const handleClick = event => {
    //* Handle clicks on card images (for opening lightboxes)
    if (
      event.target.tagName === 'IMG' &&
      Object.values(event.target.classList).some(c =>
        ['card-img', 'card-img-bottom', 'card-img-top'].includes(c)
      )
    ) {
      event.preventDefault()
      console.log(
        `Clicked card image! This is when we'd show a lightbox. Though that isn't actually coded yet.`,
        {
          src: event.target.src
        }
      )
    }

    //* The following is code for an attempt at wiggling disabled buttons on click
    // if (event.target.classList.contains('button-disabled')) {
    //   event.preventDefault()
    //   setTimeout(() => {
    //     event.target.blur()
    //   }, 800)
    // }
  }

  const handleKeydown = event => {
    if (![32, 13].includes(event.keyCode)) return
    if (!document.activeElement.getAttribute('keyclickable')) return
    document.activeElement.click()
  }

  const closeMenu = () => setExpanded(false)

  return (
    <div className='App'>
      <Navbar
        expanded={expanded}
        expand='md'
        bg='dark'
        variant='dark'
        className={expanded && 'expanded'}
        fixed='top'
      >
        <Container>
          <Navbar.Brand>Cauldron Awards</Navbar.Brand>
          <Navbar.Toggle onClick={() => setExpanded(expanded ? false : true)} />
          <Navbar.Collapse>
            <Nav>
              {navlinks.map((link, index) => (
                <NavLink to={link.to} key={index} onClick={closeMenu}>
                  {link.text}
                </NavLink>
              ))}
            </Nav>
            <div
              id='user'
              onClick={e => {
                if (userinfo.logged_in) {
                  e.preventDefault()
                  window.fetch(`https://cauldron2019.wormfic.net/logout`, {
                    credentials: 'include',
                    method: 'POST'
                  })
                  localStorage.removeItem('userinfo')
                  setUserinfo({})
                }
              }}
            >
              {userinfo.logged_in && userinfo.user ? (
                <>
                  <img
                    src={userinfo.user.avatar}
                    alt={`${userinfo.user.username}'s avatar`}
                    loading='lazy'
                    height='32px'
                    width='32px'
                    id='avatar'
                  />
                  <div id='userinfo'>
                    {userinfo.user.username}
                    <span id='discriminator'>
                      #{userinfo.user.discriminator}
                    </span>
                  </div>
                  <div id='logout' className='logInOrOut'>
                    <img src='images/logout.svg' alt='Logout' />
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
                    src='images/discord_logo.svg'
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

      <Container className={expanded ? 'nav-overlay' : ''}>
        <div id='top'>Jump to top.</div>
        <Router>
          <VotePage path='/vote' userData={null} />
          <NominationPage path='/nominate/*' />
          <MyNomineesPage path='/nominees' />
          <Redirect from='/' to='/vote' noThrow />
          <NotFoundPage default links={navlinks} />
        </Router>
      </Container>
    </div>
  )
}

export default App
