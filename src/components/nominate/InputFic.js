import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import Submission from '../util/Submission'
import FicTypeahead from './FicTypeahead'
import FicManual from './FicManual'
import PreviewCard from '../cards/PreviewCard'
import shortenURL from '../../functions/shortenURL'

const LINK_TYPES = [
  {
    id: 'linkSB',
    name: 'Spacebattles',
    img: '/images/sb.png',
    regex: /forum\.spacebattles\.com/i
  },
  {
    id: 'linkSV',
    name: 'Sufficient Velocity',
    img: '/images/sv.png',
    regex: /forums\.sufficientvelocity\.com/i
  },
  {
    id: 'linkQQ',
    name: 'Questionable Questing',
    img: '/images/qq.png',
    regex: /forum\.questionablequesting\.com/i
  },
  {
    id: 'linkAO3',
    name: 'Archive Of Our Own',
    img: '/images/ao3.png',
    regex: /archiveofourown\.org/i
  },
  {
    id: 'linkFFN',
    name: 'Fanfiction.net',
    img: '/images/ffn.png',
    regex: /fanfiction\.net/i
  },
  {
    id: 'linkMisc',
    name: 'Miscellaneous',
    img: '/images/misc.png'
  }
]

const InputFic = ({ save, nominee, setNominee, disabled, submitting, reset, extraFields }) => {
  const [manualInput, setManualInput] = useState({})
  const [refilledData, setRefilledData] = useState(reset ? true : false)
  const [selection, setSelection] = useState(nominee.MANUAL_INPUT === false ? nominee : null)
  const [manual, setManual] = useState(nominee.MANUAL_INPUT ? true : false)
  const [valid, setValid] = useState({ all: false })

  //* Forcibly reset data
  useEffect(() => {
    if (reset === true) {
      setManualInput({})
      setRefilledData(true)
      setValid({ all: false })
      setSelection(null)
    }
  }, [reset])

  useEffect(() => {
    if (manual) return
    setValid(selection ? { all: true } : { all: false })
    if (selection && Object.values(selection).length > 0) {
      setNominee({ ...selection, MANUAL_INPUT: false })
    } else {
      setNominee({})
    }
  }, [manual, selection, setNominee])

  //* Refill manual input data from global nominee data
  useEffect(() => {
    if (!nominee.MANUAL_INPUT || refilledData) return

    let linksArray = nominee.links || []
    let nomineeData = {...nominee}
    let nomineeLinks = {}

    linksArray.forEach(link => {
      let matched = false
      LINK_TYPES.slice(0, LINK_TYPES.length - 1).forEach(type => {
        if (!matched && link.match(type.regex)) {
          nomineeLinks[type.id] = link
          matched = true
        }
      })
      if (!matched) nomineeLinks.linkMisc = link
    })

    nomineeData.links = nomineeLinks
    setManualInput(nomineeData)
    setRefilledData(true)
  }, [nominee, refilledData])

  //* Update global nominee data with local data on change
  useEffect(() => {
    if (!manual) return
    let values = Object.values(manualInput)
    let allEmpty = values.every(v => !v || v.length === 0)
    if (values.length === 0 || allEmpty) {
      setValid({ all: false })
      setNominee({})
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
      setNominee({
        title: title,
        author: author,
        links: links,
        nsfw: manualInput.nsfw,
        MANUAL_INPUT: true
      })
    }
  }, [manual, manualInput, setNominee])

  const handleSubmit = e => {
    e.preventDefault()
    let editedData = {
      ...nominee,
      links: nominee.links.map(url => shortenURL(url))
    }
    if (!manual) editedData.approval = true
    save(editedData)
  }

  return (
    <Form onSubmit={handleSubmit}>
      {manual ? (
        <FicManual
          input={manualInput}
          setInput={setManualInput}
          disabled={disabled}
          LINK_TYPES={LINK_TYPES}
        />
      ) : (
        <FicTypeahead
          input={selection}
          setInput={setSelection}
          disabled={disabled}
          reset={reset}
        />
      )}

      <div className='preview mx-auto'>
        {(!nominee || Object.values(nominee).length === 0) && (
          <span className='text-muted '>
            {manual ? 'Enter some fic data' : 'Select a fic'} to continue.
          </span>
        )}
        {nominee && (
          <PreviewCard
            type='fic'
            fic={nominee}
            hide={Object.values(nominee).length === 0}
          />
        )}
      </div>
      
      <Submission
        tall
        disabled={!valid.all || disabled}
        text={extraFields ? 'Continue' : 'Submit'}
        submitting={submitting}
      >
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
