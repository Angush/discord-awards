import React, { useState, useEffect } from 'react'
import Spinner from './Spinner'

const LoadingIndicator = ({ timeout, children, showSlow = true }) => {
  const [hidden, setHidden] = useState(timeout ? true : false)
  const [slowLoad, setSlowLoad] = useState(false)

  // NOTE: the animation on a delayed appearance takes 1 second, so from the
  // user perspective, the delay will be ~50-70% longer than timeout.
  useEffect(() => {
    if (!timeout || !hidden) return
    const countdown = setTimeout(() => {
      setHidden(false)
    }, timeout)
    return () => clearTimeout(countdown)
  }, [hidden, timeout])

  useEffect(() => {
    if (hidden || !showSlow) return
    const countdown = setTimeout(() => {
      setSlowLoad(true)
    }, 5000)
    return () => clearTimeout(countdown)
  }, [hidden, showSlow])

  return (
    <div className={hidden ? 'loading-section delayed' : 'loading-section'}>
      <Spinner />
      <div className='loading-children'>
        {children}
        {slowLoad && (
          <div className='fade-rise'>This is taking a while, isn't it?</div>
        )}
      </div>
    </div>
  )
}

export default LoadingIndicator
