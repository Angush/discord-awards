import React from 'react'
import { Button } from 'react-bootstrap'

const Submission = props => {
  return (
    <div className='submission-options'>
      <Button
        type='submit'
        disabled={props.disabled}
        className={props.tall && 'height-lg'}
        variant={props.disabled ? 'outline-primary' : 'primary'}
      >
        Submit
      </Button>
      {props.children && (
        <div className='submission-alternatives'>{props.children}</div>
      )}
    </div>
  )
}

export default Submission
