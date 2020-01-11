import React from 'react'
import InputOther from './InputOther'
import InputArt from './InputArt'
import InputFic from './InputFic'

const InputMain = ({ save, type, category, disabled = false }) => {
  const INPUT_SELECTOR = {
    other: <InputOther save={save} category={category} disabled={disabled} />,
    art: <InputArt save={save} disabled={disabled} />,
    fic: <InputFic save={save} disabled={disabled} />
  }

  return INPUT_SELECTOR[type] || INPUT_SELECTOR.other
}

export default InputMain
