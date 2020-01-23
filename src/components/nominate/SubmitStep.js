import React from 'react'
import { Button } from 'react-bootstrap'
import JumpTo from '../util/JumpTo'

const SubmitStep = ({ reset, nominee, error, selected }) => {
  return (
    <div id='submit-step'>
      <JumpTo id='submit-step' />
      {error ? (
        <>
          <h5>
            <small className='text-muted'>Uh-oh!</small>
          </h5>
          <h4>Sorry, something went wrong.</h4>
          <h6 style={{ margin: '20px 0' }}>
            Your {selected.categories[0].section.toLowerCase()} nominee could
            not be submitted at this time. Try again later, or contact Angush.
          </h6>
        </>
      ) : (
        <>
          <h5>
            <small className='text-muted'>All done!</small>
          </h5>
          <h4>Nominee submitted!</h4>
          <h6 style={{ margin: '20px 0' }}>
            Your {selected.categories[0].section.toLowerCase()} nominee was
            submitted in{' '}
            {selected.categories.length > 1
              ? 'these categories'
              : 'this category'}
            :
          </h6>
          <ol>
            {selected.categories.map(category => (
              <li
                style={{ paddingLeft: '10px', marginLeft: '-10px' }}
                key={category.name}
              >
                <strong>{category.name}</strong>
                <br />
                {category.description}
              </li>
            ))}
          </ol>
        </>
      )}

      <Button
        className='height-lg'
        variant={error ? 'outline-danger' : 'outline-primary'}
        onClick={reset}
        style={{ marginTop: '10px' }}
      >
        Nominate something else
      </Button>
    </div>
  )
}

export default SubmitStep
