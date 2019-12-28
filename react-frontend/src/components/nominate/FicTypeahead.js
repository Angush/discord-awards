import React, { useState } from 'react'
import { InputGroup } from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
const allFics = Object.values(require('../../FanficTitlesAndIDs.json'))

const FicTypeahead = ({ contest }) => {
  const [selection, setSelection] = useState([])
  const [fics] = useState(allFics)

  return (
    <>
      <InputGroup>
        <Typeahead
          onChange={selected => setSelection(selected)}
          options={fics}
          selected={selection}
          paginate={true}
          maxResults={15}
          placeholder='Search for a fic...'
          bsSize='lg'
          labelKey={option =>
            option.author ? `${option.title} by ${option.author}` : option
          }
          id='typeahead'
        />
      </InputGroup>
      <div id='selected'>
        Selected:
        {selection.length > 0
          ? selection.map(fic => (
              <div className='bold' key={fic.title ? fic.title : fic}>
                {fic.author ? `${fic.title} by ${fic.author}` : fic}
              </div>
            ))
          : ' None!'}
      </div>
    </>
  )
}

export default FicTypeahead
