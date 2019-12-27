import React, { useState, useEffect } from 'react'
import CategoryInfo from '../components/CategoryInfo'
import axios from 'axios'

const CategoryPage = () => {
  const [contests, setContests] = useState(null)

  useEffect(() => {
    axios.get(`http://localhost:3001/api/contests`).then(res => {
      let data = res.data
      setContests(data)
    })
  }, [])

  return (
    <div>
      {!contests ? (
        <p>Loading category info...</p>
      ) : (
        contests.map(contest => (
          <CategoryInfo data={contest} key={contest.id} />
        ))
      )}
    </div>
  )
}

export default CategoryPage
