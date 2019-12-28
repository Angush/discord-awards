import React from 'react'

const InputClear = ({ onClick }) => {
  const props = {
    'keyboard-clickable': 'true'
  }
  return (
    <span className='input-clear' onClick={onClick} tabIndex={0} {...props}>
      <svg
        className='bi bi-x-circle'
        width='32px'
        height='32px'
        viewBox='0 0 20 20'
        fill='currentColor'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          fillRule='evenodd'
          d='M10 17a7 7 0 100-14 7 7 0 000 14zm0 1a8 8 0 100-16 8 8 0 000 16z'
          clipRule='evenodd'
        ></path>
        <path
          fillRule='evenodd'
          d='M12.646 13.354l-6-6 .708-.708 6 6-.708.708z'
          clipRule='evenodd'
        ></path>
        <path
          fillRule='evenodd'
          d='M7.354 13.354l6-6-.708-.708-6 6 .708.708z'
          clipRule='evenodd'
        ></path>
      </svg>
    </span>
  )
}

export default InputClear
