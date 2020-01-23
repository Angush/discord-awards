import React from 'react'
import { Card } from 'react-bootstrap'
import SelectableCard from '../cards/SelectableCard'

const CategoryTypeSelect = ({ types, selected, select, hidden }) => {
  return (
    <div className={'type-selection fade-rise' + (hidden ? ' hidden' : '')}>
      <h5 id='category-selection-heading' className='align-bottom'>
        <small className='text-muted'>Step 1</small>
      </h5>
      <h4 className='align-top'>Select nomination type</h4>
      <div className='card-list'>
        {types.map(({ type, section }) => (
          <SelectableCard
            key={section}
            hidden={hidden}
            selected={selected && type === selected}
            onClick={e => {
              e.preventDefault()
              select(type)
            }}
          >
            <Card.Body>
              <Card.Title className='h4'>{section}</Card.Title>
            </Card.Body>
          </SelectableCard>
        ))}
      </div>
    </div>
  )
}

export default CategoryTypeSelect
