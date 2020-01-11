import React, { useState } from 'react'
import { InputGroup } from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
import InputClear from '../util/InputClear'
const allFics = require('../../json/SimpleFics.json')

const FicTypeahead = ({ input, setInput, disabled }) => {
  const [searchterm, setSearchterm] = useState('')
  const [typeahead, setTypeahead] = useState(null)

  return (
    <InputGroup id='typeahead-container'>
      <Typeahead
        onInputChange={text => setSearchterm(text)}
        ref={ref => setTypeahead(ref)}
        onChange={selected => {
          setInput(selected[0])
          let text = typeahead.getInstance().getInput()
          setSearchterm(text.value)
        }}
        options={allFics}
        selected={input && [input]}
        value={input}
        paginate={true}
        maxResults={15}
        placeholder='Search for a fic...'
        bsSize='lg'
        labelKey={fic => `${fic.title} by ${fic.author}`}
        id='typeahead'
        disabled={disabled}
      />
      {searchterm && (
        <InputClear
          onClick={() => {
            typeahead.getInstance().clear()
            setInput(null)
            setSearchterm('')
          }}
          hidden={disabled}
        />
      )}
    </InputGroup>
  )
}

export default FicTypeahead
