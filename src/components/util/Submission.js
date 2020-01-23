import React from 'react'
import { Button } from 'react-bootstrap'
import LoadingIndicator from './LoadingIndicator'

const Submission = ({
  tall,
  disabled,
  children,
  onClick,
  text = 'Submit',
  submitting = null
}) => {
  const classes =
    (tall ? 'height-lg' : '') + (submitting ? ' submitting-btn' : '')

  return (
    <div className='submission-options'>
      <Button
        type='submit'
        className={classes}
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
              margin: '2px'
            }}
            spinnerOnly={true}
          />
        ) : (
          text
        )}
      </Button>
      {children && <div className='submission-alternatives'>{children}</div>}
    </div>
  )
}

export default Submission
