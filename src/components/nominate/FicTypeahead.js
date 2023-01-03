import React, { useEffect, useState } from 'react'
import { InputGroup } from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
import InputClear from '../util/InputClear'

const FicTypeahead = ({ input, setInput, disabled, reset, fallback }) => {
  const [searchterm, setSearchterm] = useState('')
  const [typeahead, setTypeahead] = useState(null)
  const [fics, setFics] = useState(null)

  useEffect(() => {
    if (reset === true && typeahead) {
      setSearchterm('')
      typeahead.getInstance().clear()
    }
  }, [reset, typeahead])

  useEffect(() => {
    if (!!fics) return
    try {
      const potentialOptions = JSON.parse(localStorage.typeaheadOptions)
      const typeaheadOptionsFetchDate = localStorage.typeaheadOptionsFetchDate
      const rawDifference = Date.now() - (typeaheadOptionsFetchDate || 0)
      const difference = Math.ceil(rawDifference / 1000 / 60 / 60 / 24)
      if (
        difference <= 1 &&
        Array.isArray(potentialOptions) &&
        potentialOptions.every(
          v =>
            v.title ||
            v.name ||
            v.owner ||
            v.links ||
            v.link ||
            v.description ||
            v.url
        )
      ) {
        setFics(potentialOptions)
        return
      }
    } catch (err) {}

    const controller = new AbortController()
    window
      .fetch(`https://cauldron.angu.sh/api/typeahead-options`, {
        signal: controller.signal,
      })
      .then(response => {
        if (response.ok) return response.json()
        else fallback()
      })
      .then(data => {
        if (!data || data.length === 0) fallback()
        else {
          setFics(data)
          localStorage.typeaheadOptions = JSON.stringify(data)
          localStorage.typeaheadOptionsFetchDate = Date.now()
        }
      })
      .catch(err => fallback())

    return () => controller.abort()
  }, [fics, fallback])

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
        options={fics || []}
        selected={input && [input]}
        value={input}
        paginate={true}
        maxResults={15}
        placeholder={
          fics ? 'Search for a fic...' : 'Fetching fics... Just a moment!'
        }
        labelKey={fic => `${fic.title} by ${fic.author}`}
        disabled={disabled || !fics}
        id='typeahead'
        bsSize='lg'
      />
      {(searchterm || input) && (
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
