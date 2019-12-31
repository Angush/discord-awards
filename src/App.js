import React, { useState, useEffect } from 'react'
import { Router, Redirect } from '@reach/router'
import { Container, Navbar, Nav } from 'react-bootstrap'
import NavLink from './components/util/NavLink'

// router pages
import NotFoundPage from './pages/NotFoundPage'
import NominationPage from './pages/NominationPage'
import VotePage from './pages/VotePage'

// css sheets
import './style/bootstrap.min.css'
import './style/App.css'

const App = () => {
  const [expanded, setExpanded] = useState(false)
  const [navlinks] = useState([
    {
      text: 'Vote',
      to: '/vote'
    },
    {
      text: 'Nominate',
      to: '/nominate'
    }
  ])

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown)
  }, [])

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
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container>
        <div id='top'>Jump to top.</div>
        <Router>
          <VotePage path='/vote' userData={null} />
          <NominationPage path='/nominate/*' />
          <Redirect from='/' to='/nominate' noThrow />
          <NotFoundPage default links={navlinks} />
        </Router>
      </Container>
    </div>
  )
}

export default App
