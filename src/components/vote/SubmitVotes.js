import React from 'react'
import { Button } from 'react-bootstrap'
import LoadingIndicator from '../util/LoadingIndicator'

const SubmitVotes = ({ submitting = null, children, disabled, onClick }) => {
  return (
    <Button
      type='submit'
      id='submit-votes'
      className={submitting ? 'submitting-btn' : ''}
      disabled={disabled || submitting}
      tabIndex={disabled || submitting ? -1 : 0}
      variant={disabled ? 'outline-primary' : 'primary'}
      onClick={disabled || submitting ? null : onClick}
    >
      {submitting ? (
        <LoadingIndicator
          className='inline-load submit-progress'
          spinnerProps={{
            width: '10px',
            height: '10px',
            margin: '2px',
            color: 'black'
          }}
          spinnerOnly={true}
        />
      ) : (
        children
      )}
    </Button>
  )
}

export default SubmitVotes
