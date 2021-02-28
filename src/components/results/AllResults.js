import React from 'react'
import ResultsTableOfContents from './ResultsTableOfContents'
import SelectAnotherYear from './SelectAnotherYear'
import ResultsSummary from './ResultsSummary'
import MapOfSections from './MapOfSections'

const AllResults = ({ data, toc, year, userData, userVotes = {}, userCategoryVotes = {}, children }) => {
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