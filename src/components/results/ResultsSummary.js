import React from 'react'

const ResultsSummary = ({ header, year, userData, userVotes, children }) => {
  if (!header || !header.paragraphs) return children
  const { paragraphs = {} } = header 

  const paragraphData = () => {
    const hasAnyParagraphs = (paragraphs?.primary?.length || 0) + (paragraphs?.secondary?.length || 0)
    if (!hasAnyParagraphs) return null
    return (
      <>
        {paragraphs?.primary?.map((para, index) => (
          <p key={index} className='para-primary'>
            {para}
          </p>
        ))}
        {paragraphs?.secondary?.map((para, index) => (
          <p key={index} className='para-secondary'>
            {para}
          </p>
        ))}
        {children && <hr />}
      </>
    )
  }

  return (
    <div className='results-summary'>
      <h1>The Cauldron Awards {year}</h1>
      {paragraphData()}
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
