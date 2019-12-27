import React, { useState, useEffect } from 'react'
import axios from 'axios'

const NominationOptionsPage = () => {
  const [contestTypes, setContestTypes] = useState([])

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
