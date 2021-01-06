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
  collections,
  submitting,
  setDone,
  done
}) => {
  const [searchterm, setSearchterm] = useState('')
  const [matching, setMatching] = useState(categories)

  useEffect(() => {
    let term = searchterm.toLowerCase().trim()
    if (!term) setMatching(categories)
    else {
      setMatching(
        categories.filter(
          c =>
            (c.collection && c.collection.includes(term)) ||
            c.name.toLowerCase().includes(term) ||
            (c.description && c.description.toLowerCase().includes(term)) ||
            selected.some(s => s.id === c.id)
        )
      )
    }
  }, [categories, searchterm, selected])

  const handleInputChange = e => {
    jumpToId('category-selection', { offset: 56, smooth: false })
    setSearchterm(e.target.value.trim())
  }

  const clearInput = () => {
    jumpToId('category-selection', { offset: 56, smooth: false })
    setSearchterm('')
  }

  //  TODO: if there are more than one "Collection" types for a category, split up the card display, with a section for each Collection.
  //! NOTE: currently, the Collection is included within the category cards themselves, rather than spliting cards into distinct groups. The latter option would be preferable, I think, but it's more complicated to implement, so for the time being, they're in the cards so that other more important functionality can be worked on first.

  return (
    <div id='category-selection'>
      {multiple && (
        <p className='text-muted' style={{ margin: 0 }}>
          You may select multiple. Note that when searching, selected categories are always included in results.
        </p>
      )}
      <div className={'category-input' + (done || submitting ? '' : ' stick')}>
        <InputGroup size='lg'>
          <FormControl
            id={!done && 'input-clearable'}
            placeholder='Search for a category...'
            disabled={done || submitting}
            onChange={handleInputChange}
          />
          {searchterm && (
            <InputClear
              onClick={clearInput}
              selector='#input-clearable'
              hidden={done || submitting}
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
              hidden={done || submitting}
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
              {category.collection && <Card.Text className="category-collection">{category.collection}</Card.Text>}
            </SelectableCard>
          )
        })}
        {matching.length > 0 && padWithEmptyElements(null, 4, 'contest-filler')}
        {matching.length === 0 && (
          <div
            className='text-center mx-auto no-results'
            style={{ marginBottom: '10px' }}
          >
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
          text={
            `Continue${
              selected.length > 0
                ? ` with ${selected.length} ${selected.length > 1 ? `categories` : `category`}`
                : ``
            }`
          }
          disabled={done || selected.length === 0}
          onClick={() => setDone()}
          submitting={submitting}
        />
      )}
    </div>
  )
}

export default SelectCategory
