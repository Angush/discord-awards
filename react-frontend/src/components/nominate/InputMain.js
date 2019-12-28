import React, { useEffect } from 'react'
import { Button } from 'react-bootstrap'
import InputFic from './InputFic'

const InputMain = ({ select, deselect, selected }) => {
  useEffect(() => {
    document.getElementById('input-main').scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    })
  }, [])

  const GoBack = () => (
    <Button variant='link' onClick={deselect}>
      {'< Go back'}
    </Button>
  )

  const INPUT_SELECTOR = {
    fic: <InputFic contest={selected} />,
    art: <div>Art input not implemented.</div>,
    text: (
      <div>
        How did you even <em>get</em> here?
      </div>
    )
  }

  return (
    <>
      {INPUT_SELECTOR[selected.type]}
      <GoBack />
    </>
  )
}

export default InputMain
