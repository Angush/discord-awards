import React from 'react'
import { Link } from '@reach/router'
import PageHelmet from '../components/util/PageHelmet'

const ResultsListingsPage = ({ years }) => {
  const pageMetadata = (
    <PageHelmet
      meta={{
        description:
          years?.length > 0
            ? `View results for the ${years[0]} Cauldron Awards, or for earlier years.`
            : `View results for earlier years of the Cauldron Awards.`,
        title: `Past Results - Cauldron Awards`,
        image: `/images/metadata/results.png`,
        robots: 'noindex',
      }}
    />
  )

  if (!years || years.length === 0)
    return (
      <div className='result-years fade-rise'>
        {pageMetadata}
        <h3>No results available.</h3>
      </div>
    )

  return (
    <div className='result-years fade-rise'>
      {pageMetadata}
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
