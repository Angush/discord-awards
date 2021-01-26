import React, { useState, useEffect, useCallback } from 'react'
import { Router, Redirect, Location } from '@reach/router'
import { Container } from 'react-bootstrap'
import AppNavBar from './components/util/AppNavBar'

// router pages
import VotePage from './pages/VotePage'
import NotFoundPage from './pages/NotFoundPage'
import NominationPage from './pages/NominationPage'
import MyNomineesPage from './pages/MyNomineesPage'
import ResultsListingsPage from './pages/ResultsListingsPage'
import ResultsPage from './pages/ResultsPage'
import AdminVettingPageWrapper from './pages/AdminVettingPageWrapper'

// css sheets & functions
import envVarIsTrue from './functions/envVarIsTrue'
import './style/bootstrap.min.css'
import './style/App.css'

const VOTING_CLOSED = envVarIsTrue(`VOTING_CLOSED`)
const NOMINATIONS_CLOSED = envVarIsTrue(`NOMINATIONS_CLOSED`)

const years = ['2019']
const navlinks = [
  {
    to: '/results',
    root: '/results',
    text: 'Past Results',
    navClass: 'vote-nav',
    classOn: {
      root: false,
      children: true
    }
  },
  (
    VOTING_CLOSED ? null : {
      to: '/vote',
      text: 'Vote',
      navClass: 'vote-nav'
    }
  ),
  (
    NOMINATIONS_CLOSED ? null : {
      to: '/nominate',
      text: 'Nominate',
      navClass: 'nominate-nav'
    }
  ),
  (
    NOMINATIONS_CLOSED && VOTING_CLOSED ? null : {
      to: '/nominees',
      text: 'My Nominees'
    }
  )
].filter(navlink => navlink)

const App = () => {
  const [userData, setUserData] = useState({})

  const handleKeydown = useCallback(event => {
    if (![32, 13].includes(event.keyCode)) return
    if (!document.activeElement.getAttribute('keyclickable')) return
    document.activeElement.click()
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown)

    let cached = localStorage.userData
    if (cached)
      try {
        setUserData(JSON.parse(cached))
        setUserData({ ...JSON.parse(cached), LOADED_FROM_CACHE: true })
        // setUserData({ ...JSON.parse(cached), logged_in: false })
      } catch (e) {}

    window
      .fetch(`https://cauldron.angu.sh/api/auth`, {
        credentials: 'include'
      })
      .then(response => response.json())
      .then(data => {
        setUserData(data)
        let stringified = JSON.stringify(data)
        localStorage.userData = stringified
      })
  }, [handleKeydown])

  const logout = event => {
    if (userData.logged_in) {
      event.preventDefault()
      window.fetch(`https://cauldron.angu.sh/api/logout`, {
        credentials: 'include',
        method: 'POST'
      })
      localStorage.removeItem('userData')
      setUserData({})
    }
  }

  const redirectLocation = process.env.REACT_APP_DEFAULT_REDIRECT ||
    (NOMINATIONS_CLOSED && VOTING_CLOSED ? '/results/latest' :
      (!NOMINATIONS_CLOSED ? '/nominate' : (!VOTING_CLOSED ? '/vote' : '/results/latest'))
    )

  return (
    <div className='App'>
      <Location>
        {props => (
          <AppNavBar
            logout={logout}
            navlinks={navlinks}
            userData={userData}
            location={props.location}
          />
        )}
      </Location>

      <Container>
        <div id='top'>Jump to top.</div>
        <Router>
          <VotePage path='/vote' userData={userData} />
          <NominationPage path='/nominate/*' />
          <MyNomineesPage path='/nominees' />
          <ResultsListingsPage path='/results' years={years} />
          <AdminVettingPageWrapper path='/admin/vetting' userData={userData} />
          <ResultsPage
            path='/results/:year/*'
            userData={userData}
            years={years}
          />
          <Redirect from='/' to={redirectLocation} noThrow />
          <NotFoundPage default links={navlinks} />
        </Router>
      </Container>
    </div>
  )
}

export default App
