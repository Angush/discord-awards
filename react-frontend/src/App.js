import React, { useState, useEffect } from 'react'
// import { useCookies } from 'react-cookie'
import { Router } from '@reach/router'
import { Container, Navbar, Nav } from 'react-bootstrap'
import NavLink from './components/NavLink'
import VotePage from './pages/VotePage'
import NominationPage from './pages/NominationPage'
// import ErrorPage from './pages/ErrorPage'

import './style/bootstrap.min.css'
import './style/App.css'

const App = () => {
  const [expanded, setExpanded] = useState(false)
  const [navlinks] = useState([
    {
      text: 'Vote',
      to: '/'
    },
    {
      text: 'Nominate',
      to: '/nominate'
    }
  ])
  // const [userData, setUserData] = useState({})
  // const [cookies, , removeCookies] = useCookies(['discord_data'])

  // ! it doesn't load when the "discord_data" cookie is present. figure out why!
  // * look more at the react-cookie docs maybe?

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown)
  }, [])

  // useEffect(() => {
  //   if (cookies && cookies.discord_data && !userData.loggedOut) {
  //     console.log()
  //     setUserData(cookies.discord_data)
  //   }
  // }, [userData, cookies])

  // const logout = () => {
  //   removeCookies('discord_data')
  //   setUserData({})
  // }

  // const login = () => {
  //   window.location.href = 'http://10.0.0.65:3001/login'
  // }

  const handleKeydown = event => {
    if (![32, 13].includes(event.keyCode)) return
    if (!document.activeElement.getAttribute('keyboard-clickable')) return
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
          <Navbar.Brand>Cauldron Awards 2019</Navbar.Brand>
          <Navbar.Toggle onClick={() => setExpanded(expanded ? false : true)} />
          <Navbar.Collapse>
            <Nav>
              {navlinks.map((link, index) => (
                <NavLink to={link.to} key={index} onClick={closeMenu}>
                  {link.text}
                </NavLink>
              ))}
            </Nav>
            {/* {userData.id ? (
              <div id='user'>
                <img src={userData.avatar} alt='User avatar' />
                <p>
                  <span id='username'>{userData.username}</span>
                  <span id='discriminator'>{`#${userData.discriminator}`}</span>
                </p>
                <button onClick={logout}>Logout</button>
              </div>
            ) : (
              <button onClick={login}>Login</button>
            )} */}
            {/* : <a href="http://10.0.0.65:3001/login">Login</a>} */}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <div id='top'>Jump to top.</div>
        <Router>
          <VotePage path='/' userData={null} />
          <NominationPage path='/nominate' />
        </Router>
      </Container>

      {/* <div
        className='back-to-top'
        onClick={() => {
          window.scrollTo({
            top: document.getElementById('top'),
            behavior: 'smooth'
          })
        }}
      >
        Back to top.
      </div> */}
    </div>
  )
}

export default App
