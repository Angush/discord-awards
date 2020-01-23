import React from 'react'
import InputOther from './InputOther'
import InputArt from './InputArt'
import InputFic from './InputFic'

const InputMain = ({ save, type, category, submitting, disabled = false }) => {
  const INPUT_SELECTOR = {
    other: (
      <InputOther
        save={save}
        category={category}
        disabled={disabled}
        submitting={submitting}
      />
    ),
    art: <InputArt save={save} disabled={disabled} submitting={submitting} />,
    fic: <InputFic save={save} disabled={disabled} submitting={submitting} />
  }

  return INPUT_SELECTOR[type] || INPUT_SELECTOR.other
}

export default InputMain
