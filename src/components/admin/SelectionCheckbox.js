import React from 'react'

const SelectionCheckbox = ({ onClick, checkboxClass = '', divClass = '', value = false, ...otherProps }) => {
  return (
    <div
      onClick={onClick}
      className={`nominee-checkbox-container ${value ? 'nominee-checked' : ''} ${divClass}`}
    >
      <input
        {...otherProps}
        type='checkbox'
        className={`nominee-checkbox ${checkboxClass}`}
        onChange={() => {}}
        checked={value}
      />
    </div>
  )
}

export default SelectionCheckbox