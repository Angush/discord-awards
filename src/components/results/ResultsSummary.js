import React from 'react'

const ResultsSummary = ({ header, year, children }) => {
  if (!header || !header.paragraphs) return children
  const { paragraphs } = header
  const hasPrimaryParagraphs =
    paragraphs.primary && paragraphs.primary.length > 0

  return (
    <div className='results-summary'>
      <h1>The Cauldron Awards {year}</h1>
      {hasPrimaryParagraphs &&
        paragraphs.primary.map((para, index) => (
          <p key={index} className='para-primary'>
            {para}
          </p>
        ))}
      {paragraphs.secondary.map((para, index) => (
        <p key={index} className='para-secondary'>
          {para}
        </p>
      ))}
      {children && <hr />}
      {children}
    </div>
  )
}

export default ResultsSummary
