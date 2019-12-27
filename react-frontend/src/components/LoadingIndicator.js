import React, { useState, useEffect } from 'react'
import Spinner from './Spinner'

const LoadingIndicator = props => {
  const [hidden, setHidden] = useState(props.timeout ? true : false)

  // NOTE: the animation on a delayed appearance takes 1 second, so from the
  // user perspective, the delay will be ~50-70% longer than props.timeout.
  useEffect(() => {
    if (!props.timeout || !hidden) return
    const timeout = setTimeout(() => {
      setHidden(false)
    }, props.timeout)
    return () => clearTimeout(timeout)
  }, [hidden, props.timeout])

  return (
    <div className={hidden ? 'loading-section delayed' : 'loading-section'}>
      <Spinner />
      <div className='loading-children'>{props.children}</div>
    </div>
  )
}

export default LoadingIndicator
