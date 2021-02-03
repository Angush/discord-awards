import React from 'react'

const dummyOnChange = () => {}

const SelectionCheckbox = ({ onClick, value = false, checkboxClass = '', divClass = '', ...props }) => {
  return (
    <div
      onClick={onClick}
      className={`nominee-checkbox-container ${value ? 'nominee-checked' : ''} ${divClass}`}
    >
      <input
        {...props}
        type='checkbox'
        className={`nominee-checkbox ${checkboxClass}`}
        onChange={dummyOnChange}
        checked={value}
      />
    </div>
  )
}

export default SelectionCheckbox