import React, { useState, useEffect } from 'react'
import { InputGroup, FormControl } from 'react-bootstrap'
import CategoryInfo from '../components/CategoryInfo'
import LoadingIndicator from '../components/LoadingIndicator'
import axios from 'axios'
const MAX_PER_ROW = 4

const CategoryPage = () => {
  const [contests, setContests] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`http://localhost:3001/api/contests`).then(res => {
      setContests(res.data)
      setLoading(false)
    })
  }, [])

  const addEmptyElements = () => {
    if (!contests) return
    let needed = ((contests.length / MAX_PER_ROW) % 1) * 4
    let arr = [needed]
    return arr.map((item, index) => {
      return <div className='contest-filler' key={index}></div>
    })
  }

  if (loading)
    return (
      <LoadingIndicator timeout={1000}>
        <h4>Just a moment!</h4>
        <h6 className='text-muted'>
          We're fetching the category data for you.
        </h6>
      </LoadingIndicator>
    )

  return (
    <div className='category-selection fade-rise'>
      <InputGroup size='lg'>
        <FormControl placeholder='Search for a category...' />
      </InputGroup>
      <div className='contests'>
        {contests &&
          contests.map(contest => (
            <CategoryInfo data={contest} key={contest.id} />
          ))}
        {addEmptyElements()}
      </div>
    </div>
  )
}

export default CategoryPage
