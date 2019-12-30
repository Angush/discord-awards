import React, { useState } from 'react'
import { Form, Button, InputGroup, Image } from 'react-bootstrap'
import Submission from '../util/Submission'
import LoadingIndicator from '../util/LoadingIndicator'

const InputArt = () => {
  const [url, setURL] = useState(null)
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState(null)
  const [error, setError] = useState(false)
  const [loaded, setLoaded] = useState(false)

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

  return (
    <Form id='art-input' onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Row>
          <div className='col-md-6'>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>Title</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                placeholder='Image title (can leave blank)'
                id='imgTitle'
                size='lg'
                onChange={e => setTitle(e.target.value)}
              />
            </InputGroup>
          </div>
          <div className='col-md-6'>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>Artist</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                placeholder='Artist name'
                id='imgArtist'
                size='lg'
                onChange={e => setArtist(e.target.value)}
              />
            </InputGroup>
            <Form.Text
              className={artist === '' && 'invisible'}
              // style={{ color: 'red' }}
            >
              Artist required.
            </Form.Text>
            <div className='shrink-me'></div>
          </div>
        </Form.Row>
      </Form.Group>

      <Form.Group>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text>
              <svg
                className='bi bi-image'
                width='34px'
                height='34px'
                viewBox='0 0 20 20'
                fill='currentColor'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  fillRule='evenodd'
                  d='M16.002 4h-12a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1V5a1 1 0 00-1-1zm-12-1a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2h-12z'
                  clipRule='evenodd'
                ></path>
                <path d='M12.648 9.646a.5.5 0 01.577-.093l3.777 1.947V16h-14v-2l2.646-2.354a.5.5 0 01.63-.062l2.66 1.773 3.71-3.71z'></path>
                <path
                  fillRule='evenodd'
                  d='M6.502 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3z'
                  clipRule='evenodd'
                ></path>
              </svg>
            </InputGroup.Text>
          </InputGroup.Prepend>
          <Form.Control
            size='lg'
            placeholder='Image URL'
            id='imgLink'
            onChange={e => {
              setLoaded(false)
              setURL(e.target.value)
            }}
          />
          {/* <InputGroup.Append>
            <Button variant='dark' onClick={() => {}}>
              Upload
            </Button>
          </InputGroup.Append> */}
        </InputGroup>
        <Form.Text className={!error && 'invisible'} style={{ color: 'red' }}>
          Invalid image.
        </Form.Text>
      </Form.Group>

      <div className='shrink-me'></div>

      <Form.Group className='text-center'>
        <Form.Check
          custom
          type='switch'
          id='nomineeIsNSFW'
          label='This nominee contains explicit sexual content'
        />
      </Form.Group>

      <Submission tall disabled={!loaded || !artist} />

      {loaded && (
        <h5 className='text-center'>
          <em>{title ? title : 'Untitled'} </em>
          <span className='text-muted'>
            by <em>{artist ? artist : 'Unknown'}</em>
          </span>
        </h5>
      )}
      <div id='preview' className='mx-auto'>
        {!loaded && !error && url && <LoadingIndicator id='image-load' />}
        {url && (
          <Image
            src={url}
            alt='Your nomination (preview)'
            onLoad={() => {
              setError(false)
              setLoaded(true)
            }}
            onError={() => setError(true)}
            className={(error || !loaded) && 'd-none'}
            rounded
            fluid
          />
        )}
      </div>
    </Form>
  )
}

export default InputArt
