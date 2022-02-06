import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import StatusDropdown from './StatusDropdown'
import getMapOfHeaders from '../../functions/getMapOfHeaders'
import SelectionCheckbox from './SelectionCheckbox'

const ListOfDuplicates = ({
  duplicates,
  validCategories,
  allCategories,
  updateStatus,
  checkCategory,
  checkedCategories,
  select,
}) => {
  const [expanded, setExpanded] = useState(
    duplicates.map((dupe) => ({ [dupe.id]: false }))
  )

  const toggleExpansion = (id) =>
    setExpanded({ ...expanded, [id]: !expanded[id] })

  const duplicateNominee = (dupe) => {
    const data =
      dupe.header && dupe.subheader
        ? dupe
        : getMapOfHeaders(
            'nominees',
            { nominees: [dupe.id] },
            { [dupe.id]: dupe },
            true
          )[0]

    const dupeCategories = []
    const invalidCategories = []
    const expandedCategories = {}

    Object.keys(dupe.statuses).forEach((categoryId) => {
      let category = allCategories[categoryId]
      if (Number.isInteger(validCategories[categoryId])) {
        dupeCategories.push(category)
        return
      } else if (expanded[dupe.id]) {
        dupeCategories.push(category)
        expandedCategories[category.id] = true
      }
      invalidCategories.push(category)
    })

    return (
      <li key={dupe.id}>
        <Button variant='link' onClick={() => select(dupe.id)}>
          <code>{dupe.id}</code> {data.header}{' '}
          <span className='slash-divider'>|</span>{' '}
          <span className='text-muted'>{data.subheader}</span>
        </Button>
        <ol className='duplicates-categories-list'>
          {dupeCategories.map((category) => (
            <li
              key={`${dupe.id}-${category.id}`}
              className={
                expandedCategories[category.id] ? 'expanded-dupe-category' : ''
              }
            >
              <StatusDropdown
                status={dupe.statuses[category.id]}
                select={updateStatus}
                catId={category.id}
                id={dupe.id}
              />
              <p>
                <code>{category.id}</code> {category.name}
              </p>
              <SelectionCheckbox
                value={checkedCategories?.[dupe.id]?.[category.id]}
                onClick={() => checkCategory(dupe.id, category.id)}
              />
              {expandedCategories[category.id] && (
                <span className='expanded-indicator'>Not Shared</span>
              )}
            </li>
          ))}
        </ol>
        {invalidCategories.length > 0 && !expanded[dupe.id] && (
          <button
            className='non-duplicate-categories'
            onClick={() => toggleExpansion(dupe.id)}
          >
            Also in <code>{invalidCategories.length}</code> categories not
            shared with this nominee. Click to show.
          </button>
        )}
        {expanded[dupe.id] && (
          <button
            className='non-duplicate-categories'
            onClick={() => toggleExpansion(dupe.id)}
          >
            Click to hide <code>{invalidCategories.length}</code> categories not
            shared with this nominee.
          </button>
        )}
      </li>
    )
  }

  return <ol className='duplicates-list'>{duplicates.map(duplicateNominee)}</ol>
}

export default ListOfDuplicates
