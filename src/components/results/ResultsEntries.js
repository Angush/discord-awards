import React, { useState, useEffect } from 'react'
import Result from './Result'
import { Button } from 'react-bootstrap'

const ResultsEntries = ({
  category,
  TargetResetButton,
  expanded = false,
  userVotedFor,
}) => {
  const { id, type, nominees, voters, imageOnly } = category
  const [showExtras, setShowExtras] = useState(expanded)
  const [golds] = useState(
    nominees && nominees.length > 0
      ? nominees.filter(e => e.votes === nominees[0].votes)
      : []
  )
  const [silvers] = useState(
    !!nominees[golds.length]
      ? nominees.filter(e => e.votes === nominees[golds.length].votes)
      : []
  )
  const [bronzes] = useState(
    !!nominees[golds.length + silvers.length]
      ? nominees.filter(
          e => e.votes === nominees[golds.length + silvers.length].votes
        )
      : []
  )
  const [extras] = useState(
    golds.length + silvers.length + bronzes.length === nominees.length
      ? []
      : nominees.slice(golds.length + silvers.length + bronzes.length)
  )

  useEffect(() => {
    if (document.activeElement) document.activeElement.blur()
  }, [showExtras])

  useEffect(() => {
    setShowExtras(expanded)
  }, [expanded])

  if (!nominees || nominees.length === 0) return <div>No entries.</div>

  const votePercentage = (votes, ranked = true) =>
    votes === 0 ? (
      ranked ? null : (
        <h6>with no votes</h6>
      )
    ) : (
      <h6>
        with {votes} vote{votes === 1 ? '' : 's'}{' '}
        <span>({Math.ceil((votes / voters) * 100)}% of voters)</span>
      </h6>
    )

  const getVoteIdentifier = eID => `c${id}_e${eID}`

  return (
    <div
      className={imageOnly ? 'results-entries imageonly' : 'results-entries'}
    >
      <div className='results-gold'>
        {golds.map(entry => {
          let voteID = getVoteIdentifier(entry.id)
          return (
            <Result
              key={voteID}
              entry={entry}
              type={type}
              votedFor={userVotedFor(voteID)}
              category={category}
            />
          )
        })}
        {votePercentage(golds[0].votes)}
      </div>
      {silvers.length > 0 && (
        <div className='results-silver'>
          {silvers.map(entry => {
            let voteID = getVoteIdentifier(entry.id)
            return (
              <Result
                key={voteID}
                entry={entry}
                type={type}
                votedFor={userVotedFor(voteID)}
                category={category}
              />
            )
          })}
          {votePercentage(silvers[0].votes)}
        </div>
      )}
      {bronzes.length > 0 && (
        <div className='results-bronze'>
          {bronzes.map(entry => {
            let voteID = getVoteIdentifier(entry.id)
            return (
              <Result
                key={voteID}
                entry={entry}
                type={type}
                votedFor={userVotedFor(voteID)}
                category={category}
              />
            )
          })}
          {votePercentage(bronzes[0].votes)}
        </div>
      )}
      {extras.length > 0 && (
        <>
          <Button
            variant={showExtras ? 'dark' : 'outline-dark'}
            onClick={() => setShowExtras(!showExtras)}
          >
            {showExtras ? 'Hide' : 'Show'}
            {extras.length > 1 ? ` ${extras.length} ` : ` `}
            extra nominee
            {extras.length > 1 ? 's' : ''}
          </Button>
          {showExtras && (
            <div className='extra-results'>
              <div className='container'>
                {extras.map(entry => {
                  let voteID = getVoteIdentifier(entry.id)
                  return (
                    <Result
                      key={voteID}
                      entry={entry}
                      type={type}
                      votedFor={userVotedFor(voteID)}
                      votePercentage={votePercentage(entry.votes, false)}
                      category={category}
                    />
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}
      {showExtras && TargetResetButton}
    </div>
  )
}

export default ResultsEntries
