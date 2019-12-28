import React, { useState, useEffect } from 'react'
import { InputGroup, FormControl } from 'react-bootstrap'
import CategoryInfo from './CategoryInfo'
import LoadingIndicator from '../LoadingIndicator'
import padWithEmptyElements from '../../functions/padWithEmptyElements'
import axios from 'axios'

const SelectCategory = ({ hidden, select }) => {
  const [contests, setContests] = useState(null)
  const [wasLoading, setWasLoading] = useState(false)

  useEffect(() => {
    axios.get(`http://localhost:3001/api/contests`).then(res => {
      setContests(res.data)
      setWasLoading(true)
    })
  }, [])

  if (!contests)
    return (
      <LoadingIndicator timeout={1000}>
        <h4>Just a moment!</h4>
        <h6 className='text-muted'>
          We're fetching the category data for you.
        </h6>
      </LoadingIndicator>
    )

  let classes = `${hidden ? 'hidden' : ''} ${wasLoading ? 'fade-rise' : ''}`

  return (
    <div id='category-selection' className={classes}>
      <h5>
        <small className='text-muted align-bottom'>Step 1</small>
      </h5>
      <h4 className='align-top'>Select a category</h4>
      <InputGroup size='lg'>
        <FormControl
          placeholder='Search for a category...'
          disabled={hidden ? true : false}
        />
      </InputGroup>
      <div className='contests'>
        {contests.map(contest => (
          <CategoryInfo
            data={contest}
            key={contest.id}
            hidden={hidden}
            onClick={e => {
              e.preventDefault()
              select(contest)
            }}
          />
        ))}
        {padWithEmptyElements(contests, 4, 'contest-filler')}
      </div>
    </div>
  )
}

export default SelectCategory
