import React from 'react'
import ReactJson from 'react-json-view'
import OtherCard from '../cards/OtherCard'
import FicCard from '../cards/FicCard'
import ArtCard from '../cards/ArtCard'
import ListOfDuplicates from './ListOfDuplicates'

const VetNomineeInterface = ({ nominee, category, data, getNomineeData }) => {
  if (!nominee?.data || !data?.nominees) return (
    <div className='nominee-vet-ui no-nominee-selected'>
      <h1>Select a category & nominee to vet it!</h1>
    </div>
  )
  
  const type = nominee.data.artist ? 'art' : nominee.data.links ? 'fic' : 'other'
  const CARD = type === 'other' ? (
    <OtherCard data={nominee.data} />
  ) : type === 'art' ? (
    <ArtCard formData={nominee.data} />
  ) : (
    <FicCard fic={nominee.data} />
  )

  const getApprovalStatus = number => {
    if (number === -1) return 'Rejected'
    if (number === 0) return 'Unvetted'
    if (number === 1) return 'Approved'
    if (number === 2) return 'Selected via typeahead'
  }

  const DUPLICATES = (nominee.duplicates || []).map(dupe => {
    return getNomineeData(dupe)
  })

  const CATEGORIES = Object.keys(nominee.statuses || {}).filter(cat => cat !== category.id).map(cat => data.categories[cat])
  
  return (
    <div className='nominee-vet-ui'>
      <div className='nominee-controls'>
        <div className='nominee-header-text'>
          <h2>Viewing nominee <code>{nominee.id}</code> in <code>{category.name}</code></h2>
          <h3 className='text-muted'>
            Current approval status:{' '}
            <code>{getApprovalStatus(nominee.statuses[category.id])}</code>
          </h3>
        </div>
      </div>

      <div className='nominee-left-column'>
        <div>
          <div className='section-head'>
            <h3>Nominated by</h3>
          </div>
          {nominee.nominatedBy ? <p><code>{nominee.nominatedBy}</code></p> : <p>Unknown user.</p>}
        </div>

        <div>
          <div className='section-head'>
            <h3>Other categories</h3>
          </div>
          <ol className='nominee-categories'>
            {CATEGORIES.length > 0 && CATEGORIES.map(cat => (
              <li key={cat.name}>
                <code>{cat.id}</code> {cat.name}
              </li>
            ))}
            {CATEGORIES.length === 0 && <p>This nominee was not entered into any other categories.</p>}
          </ol>
        </div>

        <div className='section-head'>
          <h3>Card view</h3>
        </div>
        <div className='nominee-card'>{CARD}</div>
      </div>

      <div className='nominee-right-column'>
        <div className='nominee-duplicates'>
          <div className='section-head'>
            <h3>Duplicates</h3>
          </div>
          {DUPLICATES.length > 0 && (
            <>
              <p>Remember to manually check other nominees for non-identical duplicates.</p>
              <ListOfDuplicates
                validCategories={nominee.statuses}
                allCategories={data.categories}
                duplicates={DUPLICATES}
              />
            </>
          )}
          {DUPLICATES.length === 0 && <>
            <p>No identical duplicates were found for this nominee.</p>
            <p>You'll have to manually check other nominees for non-identical duplicates.</p>
          </>}
        </div>
      </div>

      <div className='nominee-json'>
        <div className='section-head'>
          <h3>Data tree</h3>
        </div>
        <ReactJson
          src={nominee.data}
          displayDataTypes={false}
          enableClipboard={false}
          onEdit={() => true}
          // onSelect={selected => {
          //   if (selected.type === "string" && validateURL(selected.value)) navigate(selected.value)
          // }}
          quotesOnKeys={false}
          name={null}
        />
      </div>
    </div>
  )
}

export default VetNomineeInterface