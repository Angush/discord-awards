import React from 'react'
import { Button } from 'react-bootstrap'
import JumpTo from '../util/JumpTo'

const SubmitStep = ({ reset, selected: { type, categories } }) => {
  const requiredTypes = {}
  if (type === 'other')
    categories[0].fields.forEach(
      field => (requiredTypes[field.id] = field.name)
    )

  return (
    <div id='submit-step'>
      <JumpTo id='submit-step' />
      <h5>
        <small className='text-muted'>That's it!</small>
      </h5>
      <h4>Nominee submitted!</h4>
      <h6>
        Your {type} nominee was submitted in{' '}
        {categories.length > 1 ? 'these categories' : 'this category'}:
      </h6>
      <ol>
        {categories.map(category => (
          <li style={{ paddingLeft: '8px' }} key={category.name}>
            <strong>{category.name}</strong>
            <br />
            {category.description}
          </li>
        ))}
      </ol>
      <Button className='height-lg' variant='danger' onClick={reset}>
        Reset
      </Button>
    </div>
  )
}

export default SubmitStep
