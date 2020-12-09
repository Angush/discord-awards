import React from 'react'

const ResultsSummary = ({ header, year, userData, userVotes, children }) => {
  if (!header || !header.paragraphs) return children
  const { paragraphs } = header
  const hasPrimaryParagraphs =
    paragraphs.primary && paragraphs.primary.length > 0

  return (
    <div className='results-summary'>
      <h1>The Cauldron Awards {year}</h1>
      {hasPrimaryParagraphs &&
        paragraphs.primary.map((para, index) => (
          <p key={index} className='para-primary'>
            {para}
          </p>
        ))}
      {paragraphs.secondary.map((para, index) => (
        <p key={index} className='para-secondary'>
          {para}
        </p>
      ))}
      {children && <hr />}
      {userData.logged_in ? (
        <>
          {userVotes === 0 ? (
            <div>You didn't vote for anything in {year}!</div>
          ) : (
            <div>
              You voted for{' '}
              <span className='summary-votecount'>{userVotes}</span>{' '}
              {userVotes === 1 ? 'entry' : 'entries'} in {year}!
            </div>
          )}
        </>
      ) : (
        <a href={`https://cauldron.angu.sh/api/login`}>
          Login here to view what you voted for.
        </a>
      )}
      {children}
    </div>
  )
}

export default ResultsSummary
