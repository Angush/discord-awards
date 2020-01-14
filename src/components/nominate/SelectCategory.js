import React, { useState, useEffect } from 'react'
import { InputGroup, FormControl, Card } from 'react-bootstrap'
import padWithEmptyElements from '../../functions/padWithEmptyElements'
import jumpToId from '../../functions/jumpToID'
import SelectableCard from '../cards/SelectableCard'
import InputClear from '../util/InputClear'
import Submission from '../util/Submission'

const SelectCategory = ({
  select,
  deselect,
  selected = [],
  multiple = false,
  categories,
  setDone,
  done
}) => {
  const [searchterm, setSearchterm] = useState('')
  const [matching, setMatching] = useState(categories)

  useEffect(() => {
    const term = searchterm.toLowerCase().trim()
    if (!term) setMatching(categories)
    else
      setMatching(
        searchterm
          ? categories.filter(
              c =>
                c.name.toLowerCase().includes(term) ||
                c.description.toLowerCase().includes(term) ||
                selected.some(s => s.id === c.id)
            )
          : categories
      )
  }, [categories, searchterm, selected])

  const handleInputChange = e => {
    jumpToId('category-selection', { offset: 56, smooth: false })
    setSearchterm(e.target.value.trim())
  }

  const clearInput = () => {
    jumpToId('category-selection', { offset: 56, smooth: false })
    setSearchterm('')
  }

  return (
    <div id='category-selection'>
      <div className={'category-input' + (done ? '' : ' stick')}>
        <InputGroup size='lg'>
          <FormControl
            id={!done && 'input-clearable'}
            placeholder='Search for a category...'
            disabled={done}
            onChange={handleInputChange}
          />
          {searchterm && (
            <InputClear
              onClick={clearInput}
              selector='#input-clearable'
              hidden={done}
            />
          )}
        </InputGroup>
      </div>

      <div className='card-container'>
        {matching.map(category => {
          let isSelected = selected.some(s => s.id === category.id)
          return (
            <SelectableCard
              key={category.id}
              hidden={done}
              selected={isSelected}
              onClick={e => {
                e.preventDefault()
                if (!isSelected) select(category)
                else if (multiple) deselect(category)
              }}
            >
              <Card.Body>
                <Card.Title>{category.name}</Card.Title>
                <Card.Text>{category.description}</Card.Text>
              </Card.Body>
            </SelectableCard>
          )
        })}
        {matching.length > 0 && padWithEmptyElements(null, 4, 'contest-filler')}
        {matching.length === 0 && (
          <div className='text-center mx-auto no-results'>
            <h5>Uh-oh! No results!</h5>
            <h6 className='text-muted'>
              Double-check your search term,
              <br />
              or try something else.
            </h6>
          </div>
        )}
      </div>
      {multiple && (
        <Submission
          tall
          disabled={done || selected.length === 0}
          onClick={() => setDone()}
        />
      )}
    </div>
  )
}

export default SelectCategory
