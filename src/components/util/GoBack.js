import React from 'react'

const GoBack = ({ disabled, target, onClick }) => {
  let props = disabled
    ? {}
    : {
        keyclickable: 'true',
        tabIndex: 0,
        onClick: event => {
          event.preventDefault()
          onClick({ event: event, target: target })
        }
      }
  return (
    <div className='goback btn-link' {...props}>
      <small>{'< Go back'}</small>
    </div>
  )
}

export default GoBack
