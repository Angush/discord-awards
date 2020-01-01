import React from 'react'
import { Button } from 'react-bootstrap'

const Submission = ({ tall, disabled, children }) => {
  const classes = tall ? 'height-lg' : ''

  //* An attempt at disabling buttons via a class (and an onClick handler in App.js), so that I could make them shake when clicked as a form of negative feedback. Wasn't a great solution. (To re-enable, uncomment the lines in App.js and below, and comment out the 'classes' declaration above and 'disabled={disabled}' below.)
  // const classes = `${tall ? 'height-lg ' : ''}${
  //   disabled ? 'button-disabled' : ''
  // }`

  return (
    <div className='submission-options'>
      <Button
        type='submit'
        className={classes}
        disabled={disabled}
        tabIndex={disabled ? -1 : 0}
        variant={disabled ? 'outline-primary' : 'primary'}
      >
        Submit
      </Button>
      {children && <div className='submission-alternatives'>{children}</div>}
    </div>
  )
}

export default Submission
