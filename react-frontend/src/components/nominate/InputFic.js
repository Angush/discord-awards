import React, { useState } from 'react'
import { InputGroup, Form, Col, Button } from 'react-bootstrap'
import { Typeahead } from 'react-bootstrap-typeahead'
import InputClear from '../util/InputClear'
const allFics = Object.values(require('../../FanficTitlesAndIDs.json'))

const InputFic = ({ contest }) => {
  const [searchterm, setSearchterm] = useState('')
  const [selection, setSelection] = useState([])
  const [typeahead, setTypeahead] = useState(null)
  const [manual, setManual] = useState(false)
  const [fics] = useState(allFics)

  if (!manual)
    return (
      <>
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
        <div id='selected'>
          Selected:
          {selection.length > 0 &&
            selection.map(fic => (
              <div className='bold' key={fic.title ? fic.title : fic}>
                {fic.author ? `${fic.title} by ${fic.author}` : fic}
              </div>
            ))}
          {selection.length === 0 && ' None!'}
        </div>
        <a href='#manual' onClick={() => setManual(true)}>
          Or click for manual input
        </a>
      </>
    )

  const LINK_TYPES = [
    {
      short: 'SB',
      long: 'Spacebattles',
      img: '/images/sb.png'
    },
    {
      short: 'SV',
      long: 'Sufficient Velocity',
      img: '/images/sv.png'
    },
    {
      short: 'QQ',
      long: 'Questionable Questing',
      img: '/images/qq.png'
    },
    {
      short: 'AO3',
      long: 'Archive Of Our Own',
      img: '/images/ao3.png'
    },
    {
      short: 'FFN',
      long: 'Fanfiction.net',
      img: '/images/ffn.png'
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
      <>
        <Form id='manual-input' onSubmit={handleSubmit}>
          <Form.Row>
            <Form.Group as={Col} controlId='ficTitle'>
              <Form.Label>Title</Form.Label>
              <Form.Control placeholder='Fic title' />
            </Form.Group>
            <Form.Group as={Col} controlId='ficAuthor'>
              <Form.Label>Author</Form.Label>
              <Form.Control placeholder='Author name' />
            </Form.Group>
          </Form.Row>

          <Form.Group id='ficIsNSFW'>
            <Form.Check
              custom
              type='switch'
              id='nomineeIsNSFW'
              label='This nominee contains explicit sexual content'
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Links</Form.Label>
            <InputGroup className='conjoined-inputs'>
              {LINK_TYPES.map(link => {
                return (
                  <InputGroup key={link.short}>
                    <InputGroup.Prepend>
                      <InputGroup.Text>
                        <img
                          src={link.img}
                          alt={`${link.long} link input icon`}
                          width='24px'
                          height='24px'
                        />
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      id={`link${link.short}`}
                      placeholder={`${link.long} link`}
                      aria-describedby={`link${link.short}`}
                    />
                  </InputGroup>
                )
              })}
            </InputGroup>
          </Form.Group>

          <Button type='submit'>Submit</Button>

          <a href='#typeahead' onClick={() => setManual(false)}>
            Or click for typeahead input
          </a>
        </Form>
      </>
    )
}

export default InputFic
