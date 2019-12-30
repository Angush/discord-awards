import React, { useState } from 'react'
import { InputGroup, Form, Button } from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
import InputClear from '../util/InputClear'
import Submission from '../util/Submission'
const allFics = Object.values(require('../../FanficTitlesAndIDs.json'))

const InputFic = ({ contest }) => {
  const [searchterm, setSearchterm] = useState('')
  const [selection, setSelection] = useState([])
  const [typeahead, setTypeahead] = useState(null)
  const [manual, setManual] = useState(false)
  const [fics] = useState(allFics)

  const handleTypeaheadSubmit = e => {
    e.preventDefault()
    console.log(selection)
  }

  if (!manual)
    return (
      <Form onSubmit={handleTypeaheadSubmit}>
        <InputGroup id='typeahead-container'>
          <Typeahead
            onInputChange={input => setSearchterm(input)}
            ref={ref => setTypeahead(ref)}
            onChange={selected => {
              setSelection(selected)
              let input = typeahead.getInstance().getInput()
              setSearchterm(input.value)
            }}
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
          {searchterm && (
            <InputClear
              onClick={() => {
                typeahead.getInstance().clear()
                setSelection([])
                setSearchterm('')
              }}
            />
          )}
        </InputGroup>

        <Submission tall>
          <Button variant='link' onClick={() => setManual(true)}>
            Enter fic details manually
          </Button>
        </Submission>

        <div id='selected' className='text-center'>
          Selected:
          {selection.length > 0 &&
            selection.map(fic => (
              <div className='bold' key={fic.title ? fic.title : fic}>
                {fic.author ? `${fic.title} by ${fic.author}` : fic}
              </div>
            ))}
          {selection.length === 0 && ' None!'}
        </div>
      </Form>
    )

  const LINK_TYPES = [
    {
      id: 'linkSB',
      name: 'Spacebattles',
      img: '/images/sb.png'
    },
    {
      id: 'linkSV',
      name: 'Sufficient Velocity',
      img: '/images/sv.png'
    },
    {
      id: 'linkQQ',
      name: 'Questionable Questing',
      img: '/images/qq.png'
    },
    {
      id: 'linkAO3',
      name: 'Archive Of Our Own',
      img: '/images/ao3.png'
    },
    {
      id: 'linkFFN',
      name: 'Fanfiction.net',
      img: '/images/ffn.png'
    },
    {
      id: 'linkMisc',
      name: 'Miscellaneous',
      img: '/images/misc.png'
    }
  ]

  const handleSubmit = e => {
    e.preventDefault()
    const data = Object.values(e.target.getElementsByTagName('input')).map(
      input => {
        return {
          id: input.id,
          value: input.type === 'checkbox' ? input.checked : input.value
        }
      }
    )
    console.log(data)
  }

  if (manual)
    return (
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Row>
            <div className='col-md-6'>
              <InputGroup size='lg'>
                <InputGroup.Prepend>
                  <InputGroup.Text>Title</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control placeholder='Fic title' id='ficTitle' />
              </InputGroup>
            </div>
            <div className='col-md-6'>
              <InputGroup size='lg'>
                <InputGroup.Prepend>
                  <InputGroup.Text>Author</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control placeholder='Author name' id='ficAuthor' />
              </InputGroup>
            </div>
          </Form.Row>
        </Form.Group>

        <Form.Group>
          <Form.Label>Links</Form.Label>
          <InputGroup className='conjoined-inputs'>
            {LINK_TYPES.map(link => {
              return (
                <InputGroup size='lg' key={link.id}>
                  <InputGroup.Prepend>
                    <InputGroup.Text>
                      <img
                        src={link.img}
                        alt={`${link.name} link input icon`}
                      />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control
                    id={link.id}
                    placeholder={`${link.name} link`}
                    aria-describedby={link.id}
                  />
                </InputGroup>
              )
            })}
          </InputGroup>
        </Form.Group>

        <Form.Group className='text-center'>
          <Form.Check
            custom
            type='switch'
            id='nomineeIsNSFW'
            label='This nominee contains explicit sexual content'
          />
        </Form.Group>

        <Submission tall>
          <Button variant='link' onClick={() => setManual(false)}>
            Select fic interactively
          </Button>
        </Submission>
      </Form>
    )
}

export default InputFic
