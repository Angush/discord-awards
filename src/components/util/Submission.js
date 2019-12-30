import React from 'react'
import { Button } from 'react-bootstrap'

const Submission = props => {
  return (
    <div className='submission-options'>
      <Button
        type='submit'
        className={props.tall && 'height-lg'}
        disabled={props.disabled}
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
