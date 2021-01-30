import React from 'react'
import getMapOfHeaders from '../../functions/getMapOfHeaders'

const ListOfDuplicates = ({ duplicates, validCategories, allCategories }) => {
  return (
    <ol className="duplicates-list">
      {duplicates.map(dupe => {
        let data = (dupe.header && dupe.subheader) ? dupe
          : getMapOfHeaders("nominees", { nominees: [dupe.id] }, { [dupe.id]: dupe }, true)[0]
        // console.log()
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
                      <code>{category.id}</code> {category.name}
                    </li>
                  )
                })
              }
            </ol>
          </li>
        )
      })}
    </ol>
  )
}

// TODO: List every duplicate + the categories they share.
// TODO: For each duplicate, show current approval status, and a checkbox (along with a Select All button).
// TODO: When any checkbox is selected, you can automatically reject them all at once, but ONLY in the categories they share with the selected nominee.
// TODO: Similar interface for the Categories list.

export default ListOfDuplicates