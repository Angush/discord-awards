import React from 'react'
import ContestEntries from './ContestEntries'

const Contest = ({ contest, nominations, toggleVote }) => {
  return (
    <div className="contest" key={contest.id}>
      <div className="contest_header">
        <h2>{contest.name}</h2>
        <p>{contest.description}</p>
      </div>
      <ContestEntries contest={contest} nominations={nominations} toggleVote={toggleVote} />
    </div>
  )
}

export default Contest