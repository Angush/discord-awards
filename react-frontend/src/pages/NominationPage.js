import React, { useState } from 'react'
import SelectCategory from '../components/nominate/SelectCategory'

const NominationPage = () => {
  const [selected, setSelected] = useState(null)

  const select = category => {
    setSelected(category)
  }

  return (
    <div className='nomination-flow'>
      <SelectCategory hidden={selected ? true : false} select={select} />
      {selected && (
        <div className='text-center fade-rise'>
          <hr></hr>
          <h6 className='text-muted'>
            <em>You selected...</em>
          </h6>
          <h4>{selected.name}</h4>
          <h6>{selected.description}</h6>
          <hr></hr>
          <a onClick={() => setSelected(null)} href='#deselect'>
            Click to deselect.
          </a>
        </div>
      )}
    </div>
  )
}

export default NominationPage
