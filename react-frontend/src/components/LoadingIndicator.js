import React, { useState, useEffect } from 'react'
import Spinner from './Spinner'

const LoadingIndicator = ({ timeout, children }) => {
  const [hidden, setHidden] = useState(timeout ? true : false)

  // NOTE: the animation on a delayed appearance takes 1 second, so from the
  // user perspective, the delay will be ~50-70% longer than timeout.
  useEffect(() => {
    if (!timeout || !hidden) return
    const countdown = setTimeout(() => {
      setHidden(false)
    }, timeout)
    return () => clearTimeout(countdown)
  }, [hidden, timeout])

  return (
    <div className={hidden ? 'loading-section delayed' : 'loading-section'}>
      <Spinner />
      <div className='loading-children'>{children}</div>
    </div>
  )
}

export default LoadingIndicator
