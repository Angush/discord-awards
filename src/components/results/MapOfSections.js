import React from 'react'
import makeSafeForURL from '../../functions/makeSafeForURL'
import ResultsEntries from './ResultsEntries'
import ResultsHeader from './ResultsHeader'
import { Button } from 'react-bootstrap'

const MapOfSections = ({ data, year, userVotes, userCategoryVotes, target, clearTarget }) => {
  const userVotedFor = id => userVotes[id] === 1

  const userCategoryVoteCount = (categories = []) => {
    let voteCount = 0
    categories.forEach(c => {
      let categoryVotes = userCategoryVotes[c.id]
      if (categoryVotes) voteCount += categoryVotes
    })
    return voteCount
  }

  const TargetResetButton = target && clearTarget && (
    <div className='target-reset-button'>
      <Button 
        variant='outline-primary'
        onClick={clearTarget}
      >
        Click to view results for the {data.totals.categories - 1} other categories!
      </Button>
    </div>
  )

  const sections = target ? [target] : (data.sections || [])

  return <div className={target ? 'fade-rise linked-section' : ''}>
    {sections.map(section => (
      <section key={section.sectionName}>
        <div
          id={makeSafeForURL(section.sectionName)}
          className='section-header'
          // tabIndex={-1}
        >
          <h2>{section.sectionName}</h2>
          <div className='section-summary'>
            <small className='text-muted'>
              {section.categories.length} {section.categories.length === 1 ? 'category' : 'categories'}
              <span className='slash-divider'> | </span>
              {section.nominees} {section.nominees === 1 ? 'entry' : 'entries'}
              <span className='slash-divider'> | </span>
              {section.votes} {section.votes === 1 ? 'vote' : 'votes'}
              <span className='slash-divider'> | </span>
              {section.voters} {section.voters === 1 ? 'voter' : 'voters'}
            </small>
          </div>
        </div>
        {(target ? [target.linkedCategory] : section.categories).map(category => {
          return (
            <div key={category.title} className={`results-category ${target ? 'linked-category' : ''}`}>
              <ResultsHeader
                year={year}
                category={category}
                userVoteCount={userCategoryVoteCount([category])}
              />
              {target && (
                <>
                  <p className='target-indicator'>You have been linked directly to this category.</p>
                  {TargetResetButton}
                </>
              )}
              <ResultsEntries
                category={category}
                userVotedFor={userVotedFor}
                expanded={target ? true : false}
                TargetResetButton={TargetResetButton}
              />
            </div>
          )
        })}
      </section>
    ))}
  </div>
}

export default MapOfSections