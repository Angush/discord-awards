import React from 'react'
import { Button } from 'react-bootstrap'
import JumpTo from '../util/JumpTo'

const SubmitStep = ({ reset, nominee, error, errorCode, selected }) => {
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
            {
              errorCode === 403 ? 
                <>
                  Wait a minute... Nominations aren't actually open right now! Whoops! 😬
                  <br /><br />
                  Either this page isn't meant to be accessible, or someone forgot to open things on the back-end. Either way, contact Angush.
                </> :
                <>
                  Your <span className='primary-text-color'>{selected.section}</span> nominee could not be submitted at this time. 😔
                  <br /><br />
                  Try again later, or contact Angush. This probably should not have happened.
                </>
            }
          </h6>
        </>
      ) : (
        <>
          <h5>
            <small className='text-muted'>All done!</small>
          </h5>
          <h4>Nominee submitted!</h4>
          <h6 style={{ margin: '20px 0' }}>
            Your <span className='primary-text-color'>{selected.section}</span> nominee was submitted in{' '}
            {selected.categories.length > 1
              ? 'these categories'
              : 'this category'}
            :
          </h6>
          <ol>
            {selected.categories.sort((a, b) => a.id - b.id).map(category => (
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

      <Button variant={error ? 'danger' : 'primary'} onClick={reset}>
        Nominate something for <strong>{selected.type === "other" ? "a new category" : "some new categories"}</strong>!
      </Button>
      <Button variant='outline-dark' onClick={() => reset("nomineeData")}>
        Nominate something for <strong>the same {selected.type === "other" ? "category" : "categories"}</strong>!
      </Button>
      <Button variant='outline-dark' onClick={() => reset("sectionSelect")}>
        Nominate <strong>something different entirely</strong>!
      </Button>
    </div>
  )
}

export default SubmitStep
