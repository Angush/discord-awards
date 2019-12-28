import React, { useState, useEffect } from 'react'
import { InputGroup, FormControl } from 'react-bootstrap'
import CategoryInfo from './CategoryInfo'
import padWithEmptyElements from '../../functions/padWithEmptyElements'
import axios from 'axios'

const CategorySelect = ({ hidden }) => {
  const [contests, setContests] = useState([])

  useEffect(() => {
    axios.get(`http://localhost:3001/api/contests`).then(res => {
      setContests(res.data)
    })
  }, [])

  return (
    <div id='category-selection' className={hidden && 'hidden'}>
      <h5>
        <small className='text-muted align-bottom'>Step 1</small>
      </h5>
      <h4 className='align-top'>Select a category</h4>
      <InputGroup size='lg'>
        <FormControl placeholder='Search for a category...' disabled={hidden} />
      </InputGroup>
      <div className='contests'>
        {contests.map(contest => (
          <CategoryInfo data={contest} key={contest.id} hidden={hidden} />
        ))}
        {padWithEmptyElements(contests, 4, 'contest-filler')}
      </div>
    </div>
  )
}

export default CategorySelect
