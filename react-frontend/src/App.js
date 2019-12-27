// import React, { useState, useEffect } from 'react'
import React from 'react'
// import { useCookies } from 'react-cookie'
import { Router, Link, Redirect } from '@reach/router'
import VotePage from './pages/VotePage'
import NominationPage from './pages/NominationPage'
import NominationOptionsPage from './pages/NominationOptionsPage'
import CategoryPage from './pages/CategoryPage'
import './style/App.css'

const App = () => {
  // const [userData, setUserData] = useState({})
  // const [cookies, , removeCookies] = useCookies(['discord_data'])

  // ! it doesn't load when the "discord_data" cookie is present. figure out why!
  // * look more at the react-cookie docs maybe?

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

  return (
    <div className='App'>
      <div id='header'>
        <div id='header_content'>
          <h1>Cauldron Awards {new Date().getFullYear()}</h1>
          <nav>
            <Link to={`/`}>Vote</Link>
            <Link to={`/nominate`}>Nominate</Link>
            <Link to={`/categories`}>Categories</Link>
          </nav>
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
        </div>
      </div>

      <Router>
        <VotePage path='/' userData={null} />
        <NominationOptionsPage path='/nominate' />
        <NominationPage path='/nominate/:contestID' />
        <CategoryPage path='/categories' />
      </Router>
    </div>
  )
}

export default App
