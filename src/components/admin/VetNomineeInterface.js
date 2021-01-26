import React from 'react'

const VetNomineeInterface = ({ nominee }) => {
  if (!nominee) return (
    <div className='nominee-vet-ui no-nominee-selected'>
      <h1>Select a category & nominee to vet it!</h1>
    </div>
  )

  return (
    <div className='nominee-vet-ui'>
      <h1>You've selected a nominee!</h1>
    </div>
  )
}

export default VetNomineeInterface