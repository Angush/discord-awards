import React from 'react'
import CriteriaContent from './CriteriaContent'

const CriteriaAccordions = ({ categories }) => {
  const defaultState = categories.length <= 3 ? { open: true } : {}
  return (
    <details className='nomination-info criteria-accordions' {...defaultState}>
      <summary>
        <span className='h6'>
          {categories.length === 1
            ? '1 selected category'
            : `${categories.length} selected categories`}{' '}
          have unique criteria stipulations or additional information.
        </span>
      </summary>
      {categories.map(cat => {
        return (
          <details key={cat.name}>
            <summary>
              <span className='h6'>{cat.name}</span>
            </summary>
            <CriteriaContent
              criteria={cat.criteria}
              className='nomination-info-details'
            />
          </details>
        )
      })}
    </details>
  )
}

export default CriteriaAccordions
