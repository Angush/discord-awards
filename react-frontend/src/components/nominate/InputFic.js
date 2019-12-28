import React from 'react'
import { Button } from 'react-bootstrap'
import FicTypeahead from './FicTypeahead'

const InputFic = ({ contest }) => {
  return (
    <div id='fic-selection'>
      <h5>
        <small className='text-muted align-bottom'>Step 2</small>
      </h5>
      <h4 className='align-top'>Select a fic to nominate</h4>
      <FicTypeahead contest={contest} />
      <Button variant='link'>Click for manual input</Button>
    </div>
  )
}

export default InputFic
