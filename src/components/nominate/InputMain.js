import React, { useEffect } from 'react'
import InputFic from './InputFic'
import InputArt from './InputArt'
import InputOther from './InputOther'

const InputMain = ({ select, deselect, category }) => {
  useEffect(() => {
    document.getElementById('input-main').scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  }, [])

  const INPUT_SELECTOR = {
    fic: <InputFic />,
    art: <InputArt />,
    other: <InputOther fields={category.fields || []} />
  }

  const GoBack = () => (
    <div
      className='goback btn-link'
      keyclickable='true'
      onClick={deselect}
      tabIndex={0}
    >
      <small>{'< Go back'}</small>
    </div>
  )

  return (
    <div id='nomination-selection' className='max-width'>
      <h5 className='align-bottom'>
        <GoBack />
        <small className='text-muted'>Step 2</small>
      </h5>
      <h4 className='align-top'>
        {category.type === 'other'
          ? `Enter your ${category.title ? ` ${category.title} ` : ``}nominee`
          : `Enter your ${category.type} nominee`}
      </h4>
      {INPUT_SELECTOR[category.type]}
    </div>
  )
}

export default InputMain
