import React from 'react'
import StatusDropdown from './StatusDropdown'
import getMapOfHeaders from '../../functions/getMapOfHeaders'

const ListOfDuplicates = ({ duplicates, validCategories, allCategories, updateStatus }) => {

  const duplicateNominee = dupe => {
    let data = (dupe.header && dupe.subheader) ? dupe
      : getMapOfHeaders("nominees", { nominees: [dupe.id] }, { [dupe.id]: dupe }, true)[0]

    return (
      <li key={dupe.id}>
        <code>{dupe.id}</code> {data.header}{' '}
        <span className="slash-divider">|</span>{' '}
        <span className="text-muted">{data.subheader}</span>
        <ol className="duplicates-categories-list">
          {Object.keys(dupe.statuses)
            .filter(categoryId => Number.isInteger(validCategories[categoryId]))
            .map(categoryId => {
              let category = allCategories[categoryId]
              return (
                <li key={`${dupe.id}-${categoryId}`}>
                  <StatusDropdown
                    status={dupe.statuses[categoryId]}
                    select={updateStatus}
                    catId={categoryId}
                    id={dupe.id}
                  />
                  <code>{category.id}</code> {category.name}
                </li>
              )
            })
          }
        </ol>
      </li>
    )
  }

  return (
    <ol className="duplicates-list">
      {duplicates.map(duplicateNominee)}
    </ol>
  )
}

// TODO: Similar interface for the Categories list.

export default ListOfDuplicates