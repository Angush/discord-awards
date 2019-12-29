import React, { useState } from 'react'
import LoadingIndicator from './LoadingIndicator'

const RiseupElement = props => {
  const [state, setState] = useState({
    isLoading: true,
    wasLoading: false
  })

  const {
    timeout = 0,
    title = 'Just a moment!',
    subtitle = "We're fetching the category data for you."
  } = props

  const doneLoading = () =>
    setState({
      isLoading: false,
      wasLoading: true
    })

  if (state.isLoading)
    return (
      <LoadingIndicator timeout={timeout}>
        <h4>{title}</h4>
        <h6 className='text-muted'>{subtitle}</h6>
      </LoadingIndicator>
    )

  return (
    <div className={state.wasLoading ? 'fade-rise' : 'loading'}>
      {props.render()}
    </div>
  )
}

export default RiseupElement
