import React, { useState, useEffect } from 'react'
import LoadingIndicator from '../components/util/LoadingIndicator'
import TableOfContents from '../components/util/TableOfContents'
import ResultsEntries from '../components/results/ResultsEntries'
import ResultsHeader from '../components/results/ResultsHeader'
import ResultsSummary from '../components/results/ResultsSummary'

import { Button } from 'react-bootstrap'
import { Link } from '@reach/router'

const ResultsPage = ({ userData, years, year }) => {
  // const [userVotes, setUserVotes] = useState({})
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [toc, setTOC] = useState({})
  const [latest] = useState(
    typeof year === 'string' && year.toLowerCase().trim() === 'latest'
  )

  // TODO: add a heading section at the very top with overall stats, some descriptive text, etc. (see 2018 results page)
  // - Also have a "Log in to see what you voted for" line, and then stats about the user's voting habits when they ARE logged in. Though this obviously requires...

  // TODO: "You voted for this!" highlighting for every nominee, sourced from the server via a new endpoint (eg. "/api/votes/:year") which, if logged in, will mimic "/api/votes" but pull the data from a local static JSON file instead.

  useEffect(() => {
    const normalized = latest ? years[0] : year
    if (years.includes(normalized)) {
      import(`../json/results/${normalized}.json`)
        .then(yearResults => {
          setData(yearResults.default)
          setLoading(false)
        })
        .catch(err => {
          console.error(err)
          setLoading(false)
        })
    } else setLoading(false)
  }, [years, year, latest])

  useEffect(() => {
    if (!data) return
    let contents = []
    data.sections.forEach(s => {
      contents.push({
        text: `${s.sectionName} Categories`,
        anchor: `#${s.sectionName.toLowerCase().replace(/\s+/g, '-')}`,
        children: s.categories.map(c => {
          return {
            text: c.title,
            anchor: `#${c.title.toLowerCase().replace(/\s+/g, '-')}`
          }
        })
      })
    })
    setTOC({
      expanded: false,
      items: contents
    })
  }, [data])

  const SelectAnotherYear = (
    <div className='results-goback'>
      <Link to='/results'>View results for other years.</Link>
    </div>
  )

  if (loading)
    return (
      <>
        <LoadingIndicator className='fade-rise'>
          <h4>Just a moment!</h4>
          <h6 className='text-muted'>
            We're loading the {latest ? 'latest' : year} results for you.
          </h6>
          {SelectAnotherYear}
        </LoadingIndicator>
      </>
    )

  if (!data)
    return (
      <div className='result-years fade-rise'>
        <h4>Year not found!</h4>
        <h4>
          <small className='text-muted'>
            I don't have any results for the year you were looking for. Sorry!
          </small>
        </h4>
        <Link to='/results'>View years with available results.</Link>
      </div>
    )

  return (
    <div className='results left-indent-container'>
      <TableOfContents
        items={toc.items}
        isOpen={toc.expanded}
        closeMenu={() => {
          setTOC({
            ...toc,
            expanded: false
          })
        }}
      />
      <div
        className={toc.expanded ? 'toc-click expanded' : 'toc-click'}
        onClick={() => setTOC({ ...toc, expanded: !toc.expanded })}
      ></div>
      <div className='fade-rise'>
        <ResultsSummary year={year} header={data.header}>
          {SelectAnotherYear}
        </ResultsSummary>

        {data.sections.map(section => (
          <section key={section.sectionName}>
            <div
              id={section.sectionName.toLowerCase().replace(/\s+/g, '-')}
              className='section-header'
              // tabIndex={-1}
            >
              <h2>{section.sectionName}</h2>
            </div>
            {section.categories.map(category => {
              return (
                <div key={category.title} className='results-category'>
                  <ResultsHeader year={year} category={category} />
                  <ResultsEntries category={category} />
                </div>
              )
            })}
          </section>
        ))}
      </div>
      <div id='floating-toc-btn'>
        <Button
          id='open-toc'
          variant='light'
          onClick={() => setTOC({ ...toc, expanded: !toc.expanded })}
        >
          <img
            alt='Toggle table of contents'
            fill='black'
            src='/images/list.svg'
            width='42px'
            height='42px'
          />
        </Button>
      </div>
    </div>
  )
}

export default ResultsPage
