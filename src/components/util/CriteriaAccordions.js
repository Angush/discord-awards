import React from 'react'
import CriteriaContent from './CriteriaContent'

const CriteriaAccordions = ({ categories }) => {
  return (
    <details className='nomination-info criteria-accordions' open>
      <summary>
        <span className='h6'>
          {categories.length === 1
            ? '1 selected category'
            : `${categories.length} selected categories`}{' '}
          have unique criteria stipulations.
        </span>
      </summary>
      {categories.map(cat => {
        return (
          <details>
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
