import React from 'react'
import { Link } from '@reach/router'
import VoteFlow from '../flows/VoteFlow'
import envVarIsTrue from '../functions/envVarIsTrue'
import PageHelmet from '../components/util/PageHelmet'

const VotePage = props => {
  // - Voting not open indicator
  const { canVet, canVote } = props.userData
  const currentYear =
    new Date().getMonth() >= 10
      ? new Date().getFullYear()
      : new Date().getFullYear() - 1

  if (envVarIsTrue('VOTING_CLOSED') && !canVet && !canVote) {
    return (
      <div className='fade-rise text-center pad-top closed-page-indicator'>
        <h3>Voting is currently closed.</h3>
        <p>It will reopen in January for the next Cauldron Awards.</p>
        <p>
          Visit <Link to='/results'>the results page</Link> to see the results
          of past years!
        </p>
        <PageHelmet
          meta={{
            description: `Cauldron Awards voting is closed. Come back in January.`,
            title: `Voting - Cauldron Awards ${currentYear}`,
            image: `/images/metadata/voting.png`,
          }}
        />
      </div>
    )
  }

  return (
    <>
      <PageHelmet
        meta={{
          description: `Cauldron Awards voting is open! Vote for your favourite fanfics and fanart and more from ${currentYear}.`,
          title: `Voting - Cauldron Awards ${currentYear}`,
          image: `/images/metadata/voting.png`,
        }}
      />
      <VoteFlow {...props} />
    </>
  )
}

export default VotePage
