import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import Submission from '../util/Submission'
import FicTypeahead from './FicTypeahead'
import FicManual from './FicManual'
import PreviewCard from '../cards/PreviewCard'

const InputFic = ({ contest }) => {
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
      let validTitle = title ? true : false
      let validAuthor = author ? true : false
      let validLinks = links.length > 0
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
    console.log(ficData)
    // sort and shorten the fic links here, pre-POST request
  }

  return (
    <Form onSubmit={handleSubmit}>
      {manual ? (
        <FicManual input={manualInput} setInput={setManualInput} />
      ) : (
        <FicTypeahead input={selection} setInput={setSelection} />
      )}

      <div id='preview' className='mx-auto'>
        {Object.values(ficData).length === 0 && (
          <span className='text-muted '>
            {manual ? 'Enter some fic data' : 'Select a fic'} to submit.
          </span>
        )}
        {ficData && (
          <PreviewCard
            type='fic'
            fic={ficData}
            className={Object.values(ficData).length === 0 && 'd-none'}
          />
        )}
      </div>

      <Submission tall disabled={!valid.all}>
        {manual ? (
          <Button variant='link' onClick={() => setManual(false)}>
            Or select fic interactively.
          </Button>
        ) : (
          <Button variant='link' onClick={() => setManual(true)}>
            Or enter fic details manually.
          </Button>
        )}
      </Submission>
    </Form>
  )
}

export default InputFic
