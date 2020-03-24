import React, { useState, useEffect } from 'react'
import TableOfContents from '../components/util/TableOfContents'
import ResultsEntries from '../components/results/ResultsEntries'
import ResultsHeader from '../components/results/ResultsHeader'
import { Button } from 'react-bootstrap'
import data from '../json/results/2019'

const ResultsPage = () => {
  const [toc, setTOC] = useState({})

  // TODO: add a heading section at the very top with overall stats, some descriptive text, etc. (see 2018 results page)
  // - Also have a "Log in to see what you voted for" line, and then stats about the user's voting habits when they ARE logged in. Though this obviously requires...

  // TODO: "You voted for this!" highlighting for every nominee, sourced from the server via a new endpoint (eg. "/api/votes/:year") which, if logged in, will mimic "/api/votes" but pull the data from a local static JSON file instead.

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
  }, [])

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
      {data.sections.map(section => (
        <section key={section.sectionName}>
          <div
            id={section.sectionName.toLowerCase().replace(/\s+/g, '-')}
            className='section-header'
            tabIndex={-1}
          >
            <h2>{section.sectionName}</h2>
          </div>
          {section.categories.map(category => {
            return (
              <div key={category.title} className='results-category'>
                <ResultsHeader category={category} />
                <ResultsEntries category={category} />
              </div>
            )
          })}
        </section>
      ))}
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
