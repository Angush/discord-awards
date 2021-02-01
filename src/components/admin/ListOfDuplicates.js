import React from 'react'
import StatusDropdown from './StatusDropdown'
import getMapOfHeaders from '../../functions/getMapOfHeaders'

const ListOfDuplicates = ({ duplicates, validCategories, allCategories, updateStatus }) => {

  const duplicateNominee = dupe => {
    const data = (dupe.header && dupe.subheader) ? dupe
      : getMapOfHeaders("nominees", { nominees: [dupe.id] }, { [dupe.id]: dupe }, true)[0]

    const dupeCategories = []
    const invalidCategories = []

    Object.keys(dupe.statuses).forEach(categoryId => {
      let category = allCategories[categoryId]
      if (Number.isInteger(validCategories[categoryId])) dupeCategories.push(category)
      else invalidCategories.push(category)
    })

    return (
      <li key={dupe.id}>
        <code>{dupe.id}</code> {data.header}{' '}
        <span className="slash-divider">|</span>{' '}
        <span className="text-muted">{data.subheader}</span>
        <ol className="duplicates-categories-list">
          {dupeCategories.map(category => {
            return (
              <li key={`${dupe.id}-${category.id}`}>
                <StatusDropdown
                  status={dupe.statuses[category.id]}
                  select={updateStatus}
                  catId={category.id}
                  id={dupe.id}
                />
                <code>{category.id}</code> {category.name}
              </li>
            )
          })}
        </ol>
        {invalidCategories.length > 0 && (
          <div className="non-duplicate-categories">
            Also in <code>{invalidCategories.length}</code> categories not shared with this nominee.
          </div>
        )}
      </li>
    )
  }

  return (
    <ol className="duplicates-list">
      {duplicates.map(duplicateNominee)}
    </ol>
  )
}

export default ListOfDuplicates