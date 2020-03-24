import React from 'react'
import { Link } from '@reach/router'

const ResultsListingsPage = ({ years }) => {
  if (!years || years.length === 0)
    return (
      <div className='result-years fade-rise'>
        <h3>No results available.</h3>
      </div>
    )

  return (
    <div className='result-years fade-rise'>
      <h3>Results</h3>
      <h4>
        <small className='text-muted'>See the latest and greatest.</small>
      </h4>
      <div className='latest'>
        <Link to={years[0]}>{years[0]}</Link>
      </div>
      {years.length > 1 && (
        <h5>
          <small className='text-muted'>
            Or view results from previous years.
          </small>
        </h5>
      )}
      <ol>
        {years.slice(1).map(year => (
          <li key={year}>
            <Link to={year}>{year}</Link>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default ResultsListingsPage
