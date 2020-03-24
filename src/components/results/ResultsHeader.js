import React, { useState } from 'react'

const ResultsHeader = ({ category }) => {
  const [anchor] = useState(category.title.toLowerCase().replace(/\s+/g, '-'))

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
    <div
      // tabIndex={-1}
      className='results-header'
      key={category.title}
      id={anchor}
    >
      <img src='/images/g24.png' alt='Left' />
      <small>Cauldron Awards 2019</small>
      <h2>{category.title}</h2>
      <small className='text-muted'>
        {entries}
        <span className='slash-divider'> | </span>
        {votes}
      </small>
      <img src='/images/g24.png' alt='Right' />
    </div>
  )
}

export default ResultsHeader
