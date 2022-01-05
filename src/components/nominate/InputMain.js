import React from 'react'
import InputOther from './InputOther'
import InputArt from './InputArt'
import InputFic from './InputFic'

const InputMain = ({
  save,
  selected,
  nominee,
  setNominee,
  disabled = false,
  submitting = false,
  extraFields = false,
}) => {
  let category = selected.categories[0]

  const INPUT_SELECTOR = {
    other: (
      <InputOther
        save={save}
        category={category}
        disabled={disabled}
        submitting={submitting}
        setNominee={setNominee}
        nominee={nominee}
        reset={selected.RESET}
      />
    ),

    art: (
      <InputArt
        save={save}
        nominee={nominee}
        setNominee={setNominee}
        disabled={disabled}
        submitting={submitting}
        reset={selected.RESET}
        extraFields={extraFields}
      />
    ),

    fic: (
      <InputFic
        save={save}
        nominee={nominee}
        setNominee={setNominee}
        disabled={disabled}
        submitting={submitting}
        reset={selected.RESET}
        extraFields={extraFields}
      />
    ),
  }

  return INPUT_SELECTOR[selected.type] || INPUT_SELECTOR.other
}

export default InputMain
