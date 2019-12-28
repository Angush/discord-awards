import React, { useState, useEffect } from 'react'
import { InputGroup, FormControl } from 'react-bootstrap'
import CategoryInfo from './CategoryInfo'
import LoadingIndicator from '../util/LoadingIndicator'
import InputClear from '../util/InputClear'
import padWithEmptyElements from '../../functions/padWithEmptyElements'
import axios from 'axios'

const SelectCategory = ({ hidden, select, selected }) => {
  const [contests, setContests] = useState(null)
  const [matching, setMatching] = useState(null)
  const [wasLoading, setWasLoading] = useState(false)
  const [searchterm, setSearchterm] = useState(null)

  useEffect(() => {
    axios.get(`http://localhost:3001/api/contests`).then(res => {
      setContests(res.data)
      setWasLoading(true)
    })
  }, [])

  useEffect(() => {
    if (!searchterm) {
      setMatching(contests)
    } else {
      const results = contests.filter(c =>
        `${c.name}\n${c.description}`.includes(searchterm)
      )
      setMatching(results)
    }
  }, [contests, searchterm])

  if (!matching)
    return (
      <LoadingIndicator timeout={1000}>
        <h4>Just a moment!</h4>
        <h6 className='text-muted'>
          We're fetching the category data for you.
        </h6>
      </LoadingIndicator>
    )

  const classes = `${hidden ? 'hidden' : ''} ${
    wasLoading ? 'fade-rise' : ''
  }`.trim()

  const handleInputChange = e => {
    if (e.target.value.trim() === '') return setSearchterm(null)
    setSearchterm(e.target.value.trim())
  }

  const clearInput = () => {
    document.getElementById('input-clearable').value = ''
    setSearchterm(null)
  }

  return (
    <div id='category-selection' className={classes}>
      <h5 id='category-selection-heading'>
        <small className='text-muted align-bottom'>Step 1</small>
      </h5>
      <h4 className='align-top'>Select a category</h4>
      <div className={'category-input' + (selected ? '' : ' stick')}>
        <InputGroup size='lg'>
          <FormControl
            id={!hidden && 'input-clearable'}
            placeholder='Search for a category...'
            disabled={hidden ? true : false}
            onChange={handleInputChange}
          />
          {searchterm && <InputClear onClick={clearInput} />}
        </InputGroup>
      </div>
      <div className='contests'>
        {matching.map(contest => (
          <CategoryInfo
            data={contest}
            key={contest.id}
            hidden={hidden}
            selected={selected && contest.id === selected.id}
            searchterm={searchterm}
            onClick={e => {
              e.preventDefault()
              select(contest)
            }}
          />
        ))}
        {padWithEmptyElements(matching, 4, 'contest-filler')}
      </div>
    </div>
  )
}

export default SelectCategory
