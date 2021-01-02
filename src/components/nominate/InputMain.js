import React from 'react'
import InputOther from './InputOther'
import InputArt from './InputArt'
import InputFic from './InputFic'

const InputMain = ({
  save,
  type,
  category,
  nominee,
  setNominee,
  disabled = false,
  submitting = false
}) => {
  const INPUT_SELECTOR = {
    other:
      <InputOther
        save={save}
        category={category}
        disabled={disabled}
        submitting={submitting}
        setNominee={setNominee}
        nominee={nominee}
      />,

    art: 
      <InputArt
        save={save}
        nominee={nominee}
        setNominee={setNominee}
        disabled={disabled}
        submitting={submitting}
      />,

    fic:
      <InputFic
        save={save}
        nominee={nominee}
        setNominee={setNominee}
        disabled={disabled}
        submitting={submitting}
      />
  }

  return INPUT_SELECTOR[type] || INPUT_SELECTOR.other
}

export default InputMain
