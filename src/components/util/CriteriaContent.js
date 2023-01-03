import React from 'react'

const createContentElement = (content, index) => {
  const key = `criteria-${index}`
  if (typeof content === 'string') {
    return <p key={key}>{content}</p>
  } else if (Array.isArray(content)) {
    return (
      <ol key={key} className='nomination-criteria'>
        {content.map((listContent, listIndex) => (
          <li key={`criteria-${index}-list-${listIndex}`}>{listContent}</li>
        ))}
      </ol>
    )
  }
  // could also have a typeof content === "object" for additional options?
  return null
}

const CriteriaContent = ({
  criteria = [],
  children,
  className = '',
  ...props
}) => {
  return (
    <div className={`criteria-content ${className}`} {...props}>
      {criteria.map(createContentElement)}
      {children}
    </div>
  )
}

export default CriteriaContent
