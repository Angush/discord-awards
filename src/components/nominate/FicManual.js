import React, { useState, useEffect } from 'react'
import { Form, InputGroup, Col } from 'react-bootstrap'
import LabelShrinkable from '../util/LabelShrinkable'
import validateURL from '../../functions/validateURL'

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

const FicManual = ({ input, setInput }) => {
  const [blurred, setBlurred] = useState({})
  const [invalidLinkString, setInvalidLinkString] = useState('')

  useEffect(() => {
    if (!input.invalidLinks) return
    let invalidNames = Object.values(input.invalidLinks).filter(l => l !== null)
    if (invalidNames.length > 0) {
      setInvalidLinkString(
        `The following links are invalid: ${invalidNames.join(', ')}`
      )
    } else setInvalidLinkString('')
  }, [input.invalidLinks])

  const blur = field => {
    if (!blurred[field]) setBlurred({ ...blurred, [field]: true })
  }

  return (
    <>
      <Form.Group>
        <Form.Row>
          <Col md='6'>
            <InputGroup size='lg'>
              <InputGroup.Prepend>
                <InputGroup.Text>Title</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                placeholder='Fic title'
                id='ficTitle'
                value={input.title || ''}
                onChange={e => setInput({ ...input, title: e.target.value })}
                onBlur={e => blur('title')}
              />
            </InputGroup>
            <LabelShrinkable valid={input.title} error={blurred.title}>
              Fic title required.
            </LabelShrinkable>
          </Col>
          <Col md='6'>
            <InputGroup size='lg'>
              <InputGroup.Prepend>
                <InputGroup.Text>Author</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                placeholder='Author name'
                id='ficAuthor'
                value={input.author || ''}
                onChange={e => setInput({ ...input, author: e.target.value })}
                onBlur={e => blur('author')}
              />
            </InputGroup>
            <LabelShrinkable valid={input.author} error={blurred.author}>
              Fic author required.
            </LabelShrinkable>
          </Col>
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
                    <img src={link.img} alt={`${link.name} link input icon`} />
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  id={link.id}
                  placeholder={`${link.name} link`}
                  aria-describedby={link.id}
                  value={(input.links && input.links[link.id]) || ''}
                  onChange={e => {
                    let valid = e.target.value
                      ? validateURL(e.target.value)
                      : true
                    let invalidLinks = input.invalidLinks || {}
                    let links = {
                      ...input.links,
                      [link.id]: e.target.value
                    }
                    let linksCount = Object.values(links).filter(l => l !== '')
                      .length
                    setInput({
                      ...input,
                      links: linksCount > 0 ? links : {},
                      invalidLinks: {
                        ...invalidLinks,
                        [link.id]: valid ? null : link.name
                      }
                    })
                  }}
                  onBlur={e => blur('links')}
                />
              </InputGroup>
            )
          })}
        </InputGroup>
        <LabelShrinkable
          valid={
            input.links &&
            Object.values(input.links).length > 0 &&
            !invalidLinkString
          }
          error={blurred.links}
        >
          {invalidLinkString
            ? invalidLinkString
            : 'Fic link required (at least one).'}
        </LabelShrinkable>
      </Form.Group>

      <Form.Group className='text-center'>
        <Form.Check
          custom
          type='switch'
          id='nomineeIsNSFW'
          label='This nominee contains explicit sexual content'
          checked={input.nsfw || false}
          onChange={e => setInput({ ...input, nsfw: e.target.checked })}
        />
      </Form.Group>
    </>
  )
}

export default FicManual
