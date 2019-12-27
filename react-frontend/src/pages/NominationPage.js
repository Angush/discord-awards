import React, { useState, useEffect } from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
// import { Typeahead, Tokenizer } from 'react-typeahead'
import axios from 'axios'
const allFics = Object.values(require('../FanficTitlesAndIDs.json'))

// ! This setion utilizes: react-bootstrap-typeahead
const NominationPage = ({ contestID }) => {
  const [selection, setSelection] = useState([])
  const [contest, setContest] = useState(null)
  const [fics] = useState(allFics)

  useEffect(() => {
    let id = parseInt(contestID)
    if (!contestID) return
    axios.get(`http://localhost:3001/api/contests`).then(res => {
      let data = res.data.filter(c => c.id === id)
      setContest(data[0])
    })
  }, [contestID])

  if (!contest) return <div>Contest {contestID} does not exist!</div>
  if (contest.type === 'fic')
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
  if (contest.type === 'art') return <div>An art contest.</div>
}

// ! This setion utilizes: react-typeahead
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
