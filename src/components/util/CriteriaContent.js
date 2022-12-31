import React from 'react'

const createContentElement = content => {
  if (typeof content === 'string') {
    return <p>{content}</p>
  } else if (Array.isArray(content)) {
    return (
      <ol className='nomination-criteria'>
        {content.map(listContent => (
          <li>{listContent}</li>
        ))}
      </ol>
    )
  }
  // could also have a typeof content === "object" for additional options?
  return null
}

const CriteriaContent = ({ criteria = [], children }) => {
  return (
    <div className='criteria-content'>
      {criteria.map(createContentElement)}
      {children}
    </div>
  )
}

export default CriteriaContent
