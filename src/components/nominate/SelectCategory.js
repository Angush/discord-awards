import React, { useState, useEffect } from 'react'
import {
  InputGroup,
  FormControl,
  Card,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap'
import padWithEmptyElements from '../../functions/padWithEmptyElements'
import jumpToId from '../../functions/jumpToID'
import SelectableCard from '../cards/SelectableCard'
import InputClear from '../util/InputClear'
import Submission from '../util/Submission'
import PortalModal from '../util/PortalModal'
import CriteriaContent from '../util/CriteriaContent'
import { SVGs } from '../admin/StatusDropdown'

const SelectCategory = ({
  select,
  deselect,
  selected = [],
  multiple = false,
  categories,
  collections,
  submitting,
  setDone,
  done,
}) => {
  const [searchterm, setSearchterm] = useState('')
  const [matching, setMatching] = useState(categories)
  const [modal, setModal] = useState(null)

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

  const showCriteriaModal = e => {
    e.preventDefault()
    e.stopPropagation()
    const id = e.currentTarget.getAttribute('data-index')
    const cat = categories[id]
    setModal(cat)
  }

  const closedCategories = categories.reduce(
    (acc, curr) => (acc += curr.closed ? 1 : 0),
    0
  )

  const inaccessible = done || submitting || modal !== null
  const criteriaProps = inaccessible
    ? {}
    : {
        tabIndex: 0,
        keyclickable: 'true',
        onClick: showCriteriaModal,
      }

  //  TODO: if there are more than one "Collection" types for a category, split up the card display, with a section for each Collection.
  //! NOTE: currently, the Collection is included within the category cards themselves, rather than spliting cards into distinct groups. The latter option would be preferable, I think, but it's more complicated to implement, so for the time being, they're in the cards so that other more important functionality can be worked on first.

  return (
    <div id='category-selection'>
      {modal && (
        <PortalModal
          title={modal.name}
          footer='Category eligibility criteria'
          close={() => setModal(null)}
        >
          <CriteriaContent criteria={modal.criteria} />
        </PortalModal>
      )}

      {multiple && (
        <p className='text-muted' style={{ margin: 0 }}>
          You may select multiple. Note that when searching, selected categories
          are always included in results.
        </p>
      )}
      {closedCategories > 0 && (
        <p className='text-muted' style={{ margin: 0 }}>
          As you have <code>nominate</code> admin permissions, you are able to
          nominate for <code>{closedCategories}</code>{' '}
          {closedCategories === 1 ? 'category' : 'categories'} that are not open
          to the public. These are indicated for your convenience.
        </p>
      )}
      <div className={'category-input' + (inaccessible ? '' : ' stick')}>
        <InputGroup size='lg'>
          <FormControl
            id={!done && 'input-clearable'}
            placeholder='Search for a category...'
            disabled={inaccessible}
            onChange={handleInputChange}
          />
          {searchterm && (
            <InputClear
              onClick={clearInput}
              selector='#input-clearable'
              hidden={inaccessible}
            />
          )}
        </InputGroup>
      </div>

      <div className='card-container'>
        {matching.map((category, index) => {
          let isSelected = selected.some(s => s.id === category.id)
          return (
            <SelectableCard
              key={category.id}
              hidden={inaccessible}
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
              <div className='card-bottom-tags'>
                {category.collection && (
                  <Card.Text className='category-collection'>
                    {category.collection}
                  </Card.Text>
                )}
                {category.closed && (
                  <Card.Text className='category-collection category-closed'>
                    Not Public
                  </Card.Text>
                )}
                {category.criteria && (
                  <OverlayTrigger
                    placement='top'
                    delay={{ show: 250 }}
                    overlay={
                      inaccessible ? (
                        <span></span>
                      ) : (
                        <Tooltip>View eligibility criteria</Tooltip>
                      )
                    }
                  >
                    <div
                      {...criteriaProps}
                      className='criteria-icon-box'
                      data-id={category.id}
                      data-index={index}
                      aria-label={`Click to view eligibility criteria for ${category.name}`}
                      title={`View eligibility criteria for ${category.name}`}
                    >
                      {SVGs.reset}
                    </div>
                  </OverlayTrigger>
                )}
              </div>
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
          text={`Continue${
            selected.length > 0
              ? ` with ${selected.length} ${
                  selected.length > 1 ? `categories` : `category`
                }`
              : ``
          }`}
          disabled={done || selected.length === 0}
          onClick={() => setDone()}
          submitting={submitting}
        />
      )}
    </div>
  )
}

export default SelectCategory
