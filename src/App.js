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

// css sheets
import './style/bootstrap.min.css'
import './style/App.css'

const navlinks = [
  // {
  //   to: '/vote',
  //   text: 'Vote',
  //   navClass: 'vote-nav'
  // }
  // {
  //   to: '/nominate',
  //   text: 'Nominate',
  //   navClass: 'nominate-nav'
  // },
  // {
  //   to: '/nominees',
  //   text: 'My Nominees'
  // },
  {
    to: '/results',
    root: '/results',
    text: 'Results',
    navClass: 'vote-nav',
    classOn: {
      root: false,
      children: true
    }
  }
]

const years = ['2019']

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
          <ResultsPage
            path='/results/:year/*'
            userData={userData}
            years={years}
          />
          <Redirect from='/' to='/results/latest' noThrow />
          <NotFoundPage default links={navlinks} />
        </Router>
      </Container>
    </div>
  )
}

export default App
