import React from 'react'

const Badge = ({ number, text = '', suffix = '', prefix = '', allCode = false, className = '' }) => {
  const classes = `vet-list-badge ${className}`

  if (allCode || Number.isInteger(number)) return (
    <div className={classes}>
      <code>
        {prefix} {number} {text} {suffix}
      </code>
    </div>
  )

  return (
    <div className={classes}>
      <span>
        {prefix} {text} {suffix}
      </span>
    </div>
  )
}

export default Badge