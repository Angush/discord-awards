import React from 'react'
import { Link } from '@reach/router'
import VoteFlow from '../flows/VoteFlow'
import envVarIsTrue from '../functions/envVarIsTrue'

const VotePage = (props) => {
  // - Voting not open indicator
  if (envVarIsTrue('VOTING_CLOSED'))
    return (
      <div className='fade-rise text-center pad-top closed-page-indicator'>
        <h3>Voting is currently closed.</h3>
        <p>It will reopen in January for the next Cauldron Awards.</p>
        <p>Visit <Link to='/results'>the results page</Link> to see the results of past years!</p>
      </div>
    )

  return <VoteFlow {...props} />

}

export default VotePage