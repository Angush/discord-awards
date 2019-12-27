import React, { useState, useEffect } from 'react'
import axios from 'axios'

const NominationOptionsPage = () => {
  const [contestTypes, setContestTypes] = useState([])

  //!  In this page:
  //*  1. Present all available categories to user (possibly with a search bar and/or type filter).
  //*  2. When user selects a category, redirect them to /nominate/:categoryID - utilizing NominationPage.js

  useEffect(() => {
    console.log(`Fetching data...`)
    axios.get(`http://localhost:3001/api/contests`).then(res => {
      let data = []
      res.data.forEach(c => {
        if (!data.includes(c.type)) data.push(c.type)
      })
      console.log(`Data fetched!`)
      console.log(data)
      setContestTypes(data)
    })
  }, [])

  if (contestTypes.length === 0)
    return <div>There are no ongoing contests to nominate for!</div>
  else
    return <div id='nomination_options'>{contestTypes.map(item => item)}</div>
}

export default NominationOptionsPage
