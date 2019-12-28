import React, { useState } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
const allFics = Object.values(require('../FanficTitlesAndIDs.json'))

const FicTypeahead = ({ contest }) => {
  const [selection, setSelection] = useState([])
  const [fics] = useState(allFics)

  return (
    <div id='content'>
      <h3>{contest.title}</h3>
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
      <Typeahead
        onChange={selected => setSelection(selected)}
        options={fics}
        selected={selection}
        paginate={true}
        maxResults={15}
        placeholder='Search for a fic...'
        autoFocus={true}
        bsSize='lg'
        labelKey={option =>
          option.author ? `${option.title} by ${option.author}` : option
        }
        id='typeahead'
      />
    </div>
  )
}

export default FicTypeahead
