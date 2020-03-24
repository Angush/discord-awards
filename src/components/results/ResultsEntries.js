import React, { useState, useEffect } from 'react'
import Result from './Result'
import { Button } from 'react-bootstrap'

const ResultsEntries = ({
  category: { id, type, nominees, voters, imageOnly }
}) => {
  const [showExtras, setShowExtras] = useState(false)
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

  if (!nominees || nominees.length === 0) return <div>No entries.</div>

  const votePercentage = votes => (
    <h6>
      with {votes} votes{' '}
      <span>({Math.ceil((votes / voters) * 100)}% of voters)</span>
    </h6>
  )

  return (
    <div
      className={imageOnly ? 'results-entries imageonly' : 'results-entries'}
    >
      <div className='results-gold'>
        {golds.map(entry => (
          <Result key={`c${id}_e${entry.id}`} entry={entry} type={type} />
        ))}
        {votePercentage(golds[0].votes)}
      </div>
      {silvers.length > 0 && (
        <div className='results-silver'>
          {silvers.map(entry => (
            <Result key={`c${id}_e${entry.id}`} entry={entry} type={type} />
          ))}
          {votePercentage(silvers[0].votes)}
        </div>
      )}
      {bronzes.length > 0 && (
        <div className='results-bronze'>
          {bronzes.map(entry => (
            <Result key={`c${id}_e${entry.id}`} entry={entry} type={type} />
          ))}
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
                {extras.map(entry => (
                  <Result
                    key={`c${id}_e${entry.id}`}
                    entry={entry}
                    type={type}
                    votePercentage={votePercentage(entry.votes)}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ResultsEntries
