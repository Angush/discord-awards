import React from 'react'
import ContestEntry from './ContestEntry'

const ContestEntries = ({ contest, nominations, toggleVote }) => {
  let entries = nominations.map(nom => nom.contests.find(c => c.id === contest.id) ? nom : null)
  let empty = entries.every(nom => !nom)
  return (
    <div className="entries">
      {empty
        ? <p className="no_entries">No entries yet! Add a nomination <a href={`/nominate/${contest.id}`}>here</a>!</p>
        : entries.map((entry, index) => {
          if (!entry) return null
          return <ContestEntry key={`${contest.id}:${index}`} id={index} contestID={contest.id} item={entry} toggleVote={toggleVote}/>
        })
      }
    </div>
  )
}

export default ContestEntries