import React, { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { Router } from '@reach/router'
import VotePage from './pages/VotePage'
import NominationPage from './pages/NominationPage'
import './App.css'


const App = () => {
  const [userData, setUserData] = useState({})
  const [cookies, , removeCookies] = useCookies(['discord_data'])

  // ! it doesn't load when the "discord_data" cookie is present. figure out why!
  // * look more at the react-cookie docs maybe?
  
  useEffect(() => {
    if (cookies && cookies.discord_data && !userData.loggedOut) {
      console.log()
      setUserData(cookies.discord_data)
    }
  }, [userData, cookies])


  const logout = () => {
    removeCookies('discord_data')
    setUserData({})
  }

  const login = () => {
    window.location.href = "http://10.0.0.65:3001/login"
  }

  return (
    <div className="App">
      <div id="header">
        <div id="header_content">
          <h1>Cauldron Awards {new Date().getFullYear()}</h1>
          {userData.id ? 
            <div id="user">
              <img src={userData.avatar} alt="User avatar"/>
              <p>
                <span id="username">{userData.username}</span>
                <span id="discriminator">{`#${userData.discriminator}`}</span>
              </p>
              <button onClick={logout}>Logout</button>
            </div>
          : <button onClick={login}>Login</button>}
          {/* : <a href="http://10.0.0.65:3001/login">Login</a>} */}
        </div>
      </div>

      <Router>
        <VotePage path="/" userData={userData} />
        <NominationPage path="/nominate" />
      </Router>

    </div>
  )
}

export default App