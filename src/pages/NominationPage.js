import React, { useState, useEffect } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
// import { Typeahead, Tokenizer } from 'react-typeahead'
const allFics = Object.values(require('../FanficTitlesAndIDs.json'))

const NominationPage = () => {
  const [selection, setSelection] = useState([])
  const [fics, setFics] = useState(allFics)

  return (
    <div id="content">
      <div id="selected">
        Selected fics: 
        {
          selection.length > 0
          ? selection.map(fic => <div className="bold">{fic}</div>)
          : " None!"
        }
      </div>
      <Typeahead
        onChange={(selected) => setSelection(selected)}
        options={fics}
        selected={selection}
        paginate={true}
        maxResults={15}
        placeholder="Search for a fic..."
        autoFocus={true}
        bsSize="lg"
      />
    </div>
  )
}

// const NominationPage = () => {
//   const [fics, setFics] = useState(allFics)
//   const [selected, setSelected] = useState([])

//   return (
//     <div id="content">
//       <Tokenizer
//         options={fics}
//         maxVisible={15}
//         placeholder="Search for a fic..."
//         resultsTruncatedMessage="Some results truncated..."
//         name="ficnomination"
//         onTokenAdd={token => {
//           let newFics = fics
//           newFics.splice(fics.indexOf(token), 1)
//           setFics(newFics)
//           setSelected([...selected, token])
//         }}
//         onTokenRemove={token => {
//           setFics([...fics, token])
//           let newSelected = selected
//           newSelected.splice(selected.indexOf(token), 1)
//           setSelected(newSelected)
//         }}
//       />
//       <div id="selected">
//         <p>Selected fics:</p>
//         {
//           selected.length > 0
//           ? selected.map(fic => <div className="bold">{fic}</div>)
//           : <div className="bold">No fics selected!</div>
//         }
//       </div>
//     </div>
//   )
// }

export default NominationPage