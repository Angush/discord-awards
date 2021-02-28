import React, { useState } from 'react'
import makeSafeForURL from '../../functions/makeSafeForURL'

const ResultsHeader = ({ year, category, userVoteCount = 0 }) => {
  const [anchor] = useState(makeSafeForURL(category.title))

  const entries =
    category.nominees.length === 0
      ? 'No entries'
      : category.nominees.length === 1
      ? '1 entry'
      : `${category.nominees.length} entries`

  const votes =
    category.nominees.length === 1 || category.votes === 1
      ? 'Default'
      : category.votes === 0
      ? 'No votes'
      : `${category.votes} votes`

  return (
    <div className='results-header-container'>
      <div
        // tabIndex={-1}
        className='results-header'
        key={category.title}
        id={anchor}
      >
        <img src='/images/g24.png' alt='Left' />
        <small>Cauldron Awards {year}</small>
        <h2>{category.title}</h2>
        <small className='text-muted'>
          {entries}
          <span className='slash-divider'> | </span>
          {votes}
          {category.voters > 0 && (
            <>
              <span className='slash-divider'> | </span>
              {category.voters} voters
            </>
          )}
        </small>
        <img src='/images/g24.png' alt='Right' />
      </div>
      {userVoteCount > 0 && (
        <h6 className='voted-for'>
          You voted for {userVoteCount}{' '}
          {userVoteCount === 1 ? 'entry' : 'entries'}
        </h6>
      )}
      <div className='category-badges'>
        {category.collection && <div className='new-indicator'>{`Collection: ${category.collection}`.toUpperCase()}</div>}
        {category.isNew && <div className='new-indicator'>NEW CATEGORY</div>}
      </div>
    </div>
  )
}

export default ResultsHeader
