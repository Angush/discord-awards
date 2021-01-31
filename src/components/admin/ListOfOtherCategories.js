import React from 'react'
import StatusDropdown from './StatusDropdown'

const ListOfOtherCategories = ({ categories, nominee, updateStatus }) => {
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
          <code>{cat.id}</code> {cat.name}
        </li>
      ))}
    </>
  )
}

export default ListOfOtherCategories