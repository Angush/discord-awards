import React, { useState } from 'react'
import { InputGroup } from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
import InputClear from '../util/InputClear'
const allFics = Object.values(require('../../FanficTitlesAndIDs.json'))

const FicTypeahead = () => {
  const [searchterm, setSearchterm] = useState('')
  const [selection, setSelection] = useState([])
  const [fics] = useState(allFics)

  return (
    <>
      <InputGroup id='typeahead-container'>
        <Typeahead
          onInputChange={input => setSearchterm(input)}
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
        {searchterm && <InputClear selector='.rbt input' />}
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
