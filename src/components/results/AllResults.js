import React, { useEffect } from 'react'
import ResultsTableOfContents from './ResultsTableOfContents'
import SelectAnotherYear from './SelectAnotherYear'
import ResultsSummary from './ResultsSummary'
import MapOfSections from './MapOfSections'
import jumpToID from '../../functions/jumpToID'

const AllResults = ({ data, toc, year, userData, userVotes = {}, userCategoryVotes = {}, location }) => {
  const jumpTarget = location?.state?.jumpedTo || null

  useEffect(() => {
    if (!jumpTarget) return
    jumpToID(jumpTarget, {
      offset: 120,
      smooth: false
    })
  }, [jumpTarget])

  return (
    <>
      <ResultsTableOfContents toc={toc} />
      <div className='fade-rise'>
        <ResultsSummary
          year={year}
          header={data.header}
          userVotes={Object.values(userVotes).length}
          userData={userData}
        >
          <SelectAnotherYear />
        </ResultsSummary>
        <MapOfSections
          data={data}
          year={year}
          userVotes={userVotes}
          userCategoryVotes={userCategoryVotes}
        />
      </div>
    </>
  )
}

export default AllResults