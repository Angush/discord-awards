import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import Submission from '../util/Submission'
import FicTypeahead from './FicTypeahead'
import FicManual from './FicManual'
import PreviewCard from '../cards/PreviewCard'
import shortenURL from '../../functions/shortenURL'

const InputFic = ({ save, disabled }) => {
  const [manualInput, setManualInput] = useState({})
  const [selection, setSelection] = useState(null)
  const [manual, setManual] = useState(false)
  const [ficData, setFicData] = useState({})
  const [valid, setValid] = useState({ all: false })

  useEffect(() => {
    if (manual) return
    setValid(selection ? { all: true } : { all: false })
    setFicData(selection ? selection : {})
  }, [manual, selection])

  useEffect(() => {
    if (!manual) return
    let values = Object.values(manualInput)
    let allEmpty = values.every(v => !v || v.length === 0)
    if (values.length === 0 || allEmpty) {
      setValid({ all: false })
      setFicData({})
    } else {
      let title = manualInput.title
      let author = manualInput.author
      let links = Object.values(manualInput.links || {})
      let invalidLinks = Object.values(manualInput.invalidLinks || {}).filter(
        l => l !== null
      )
      let validTitle = title ? true : false
      let validAuthor = author ? true : false
      let validLinks = links.length > 0 && invalidLinks.length === 0
      setValid({
        title: validTitle,
        author: validAuthor,
        links: validLinks,
        all: validTitle && validAuthor && validLinks
      })
      setFicData({
        title: title || 'Untitled',
        author: author || 'Unknown',
        links: links,
        nsfw: manualInput.nsfw
      })
    }
  }, [manual, manualInput])

  const handleSubmit = e => {
    e.preventDefault()
    let editedData = {
      ...ficData,
      links: ficData.links.map(url => shortenURL(url))
    }
    save(editedData)
  }

  return (
    <Form onSubmit={handleSubmit}>
      {manual ? (
        <FicManual
          input={manualInput}
          setInput={setManualInput}
          disabled={disabled}
        />
      ) : (
        <FicTypeahead
          input={selection}
          setInput={setSelection}
          disabled={disabled}
        />
      )}

      <div className='preview mx-auto'>
        {Object.values(ficData).length === 0 && (
          <span className='text-muted '>
            {manual ? 'Enter some fic data' : 'Select a fic'} to submit.
          </span>
        )}
        {ficData && (
          <PreviewCard
            type='fic'
            fic={ficData}
            hide={Object.values(ficData).length === 0}
          />
        )}
      </div>

      <Submission tall disabled={!valid.all || disabled}>
        {manual ? (
          <Button
            variant='link'
            onClick={() => setManual(false)}
            disabled={disabled}
          >
            Or select fic interactively.
          </Button>
        ) : (
          <Button
            variant='link'
            onClick={() => setManual(true)}
            disabled={disabled}
          >
            Or enter fic details manually.
          </Button>
        )}
      </Submission>
    </Form>
  )
}

export default InputFic
