import React, { useState, useEffect } from 'react'
import Spinner from './Spinner'

const LoadingIndicator = ({
  id,
  timeout = 0,
  children,
  noRise = false,
  showSlow = true,
  spinnerOnly = false,
  spinnerProps,
  className
}) => {
  const [hidden, setHidden] = useState(timeout > 0 ? true : false)
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
    <div
      className={
        (className ? className + ' ' : '') +
        (hidden || timeout > 0 ? 'loading-section delayed' : 'loading-section')
      }
      id={id}
    >
      <Spinner {...spinnerProps} />
      {!spinnerOnly && (
        <div className='loading-children'>
          {children ? children : <div className='shrink-me'></div>}
          {slowLoad && (
            <div className={noRise ? 'fade-in' : 'fade-rise'}>
              This is taking a while, isn't it?
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default LoadingIndicator
