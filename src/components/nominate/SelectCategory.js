import React, { useState, useEffect } from 'react'
import { InputGroup, FormControl } from 'react-bootstrap'
import CategoryInfo from './CategoryInfo'
import LoadingIndicator from '../util/LoadingIndicator'
import InputClear from '../util/InputClear'
import padWithEmptyElements from '../../functions/padWithEmptyElements'

const rawContestData = [
  {
    id: 0,
    name: 'Fic of the Year',
    type: 'fic',
    description: 'The best fic to happen this year.'
  },
  {
    id: 1,
    name: 'Favourite NSFW Fic',
    type: 'fic',
    description: 'Lewds galore. Cauldron-appropriate only!'
  },
  {
    id: 2,
    name: 'Favourite Fanart',
    type: 'art',
    description: 'Art by fans.'
  },
  {
    id: 3,
    name: 'Best Mod',
    type: 'text',
    description: 'Which Cauldron mod was the coolest in 2019?'
  }
]

const SelectCategory = ({ hidden, select, selected }) => {
  const [contests, setContests] = useState(null)
  const [matching, setMatching] = useState(null)
  const [wasLoading, setWasLoading] = useState(false)
  const [searchterm, setSearchterm] = useState('')

  useEffect(() => {
    // window
    //   .fetch(`http://192.168.1.110:3001/api/contests`)
    //   .then(response => response.json())
    //   .then(data => {
    //! timeout for force-testing the loading indicator on mobile
    setTimeout(() => {
      setContests(rawContestData)
      setWasLoading(true)
    }, 4000)
    // })
  }, [])

  useEffect(() => {
    const term = searchterm.toLowerCase()
    setMatching(
      searchterm
        ? contests.filter(
            c =>
              c.name.toLowerCase().includes(term) ||
              c.description.toLowerCase().includes(term)
          )
        : contests
    )
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
    window.scrollTo(0, 0)
    setSearchterm(e.target.value.trim())
  }

  const clearInput = () => {
    window.scrollTo(0, 0)
    setSearchterm('')
  }

  return (
    <div id='category-selection' className={classes}>
      <h5 id='category-selection-heading' className='align-bottom'>
        <small className='text-muted'>Step 1</small>
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
          {searchterm && (
            <InputClear
              onClick={clearInput}
              selector='#input-clearable'
              hidden={hidden ? true : false}
            />
          )}
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
