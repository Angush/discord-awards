import React from 'react'

const InputClear = ({ onClick, selector, hidden }) => {
  const props = !hidden && {
    onClick: e => {
      if (selector) document.querySelector(selector).value = ''
      if (onClick) onClick(e)
    }
  }
  return (
    <span className='input-clear' {...props}>
      <button type='button' className='close' aria-label='Clear input'>
        <span aria-hidden='true'>&times;</span>
      </button>
    </span>
  )
}

export default InputClear
