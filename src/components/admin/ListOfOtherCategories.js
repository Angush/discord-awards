import React from 'react'
import SelectionCheckbox from './SelectionCheckbox'
import StatusDropdown from './StatusDropdown'

const ListOfOtherCategories = ({
  categories, nominee, updateStatus, checkCategory, checkedCategories
}) => {
  return (
    <>
      {categories.map(cat => (
        <li key={cat.name}>
          <StatusDropdown
            status={nominee.statuses[cat.id]}
            select={updateStatus}
            catId={cat.id}
            id={nominee.id}
          />
          <p><code>{cat.id}</code> {cat.name}</p>
          <SelectionCheckbox
            value={checkedCategories?.[nominee.id]?.[cat.id]}
            onClick={() => checkCategory(nominee.id, cat.id)}
          />
        </li>
      ))}
    </>
  )
}

export default ListOfOtherCategories