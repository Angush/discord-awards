import React, { useEffect, useState } from 'react'
import { Form, InputGroup, Col } from 'react-bootstrap'
// import { Form, Button, InputGroup, Image } from 'react-bootstrap'
import LoadingIndicator from '../util/LoadingIndicator'
import LabelShrinkable from '../util/LabelShrinkable'
import PreviewCard from '../cards/PreviewCard'
import Submission from '../util/Submission'
import validateURL from '../../functions/validateURL'

const InputArt = ({
  save,
  disabled,
  submitting,
  nominee,
  setNominee,
  extraFields,
}) => {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)
  const [refilledData, setRefilledData] = useState(false)
  const [inputtingImage, setInputtingImage] = useState(true)
  const [nonImageInputs, setNonImageInputs] = useState([])
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    url: '',
  })
  const [extraURLs, setExtraURLs] = useState([])

  useEffect(() => {
    if (refilledData) return
    let defaultFormData = { title: '', artist: '', url: '' }
    setFormData({ ...defaultFormData, ...nominee })
    if (nominee.extraURLs) setExtraURLs(nominee.extraURLs)
    if (nominee.nonImageArtInput) setInputtingImage(false)
    setRefilledData(true)
  }, [nominee, refilledData])

  useEffect(() => {
    setNominee(formData)
  }, [formData, setNominee])

  const handleSubmit = (e) => {
    e.preventDefault()
    let editedData = { ...formData }
    if (!editedData.title) delete editedData.title
    if (!editedData.artistPage) delete editedData.artistPage
    if (!editedData.canonicalURL) delete editedData.canonicalURL
    if (editedData.hasOwnProperty('nonImageArtInput'))
      delete editedData.nonImageArtInput

    if (inputtingImage) {
      let validExtras = extraURLs.filter((url) => !!url)
      if (validExtras.length === 0) save(editedData)
      else save({ ...editedData, extraURLs })
    } else {
      editedData.links = nonImageInputs
      delete editedData.url
      save(editedData)
    }
  }

  const onLoad = () => {
    setError(false)
    setLoaded(true)
  }

  const onError = () => setError(true)

  const ImageInputLabel = (type = 'image') => {
    if (type === 'link')
      return (
        <InputGroup.Prepend>
          <InputGroup.Text style={{ width: '52px', justifyContent: 'center' }}>
            <img src='/images/misc.png' alt={`Link input icon`} />
          </InputGroup.Text>
        </InputGroup.Prepend>
      )

    if (type === 'image')
      return (
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
      )
  }

  const createAdditionalInput = (index = 0, type = 'image', offset = 2) => {
    if (type === 'link')
      return (
        <InputGroup key={`linkInput${index}`}>
          {ImageInputLabel('link')}
          <Form.Control
            size='lg'
            placeholder={
              index === 0
                ? 'Video/audio link'
                : `Video/audio link #${index + offset}`
            }
            id={`artLink${index + offset}`}
            value={nonImageInputs[index] || ''}
            onChange={(e) => {
              let links = [...nonImageInputs]
              links[index] = e.target.value
              setNonImageInputs(links)
            }}
            disabled={disabled}
          />
        </InputGroup>
      )

    if (type === 'image')
      return (
        <InputGroup key={`extraImageInput${index}`}>
          {ImageInputLabel(type)}
          <Form.Control
            size='lg'
            placeholder={`Image URL #${index + offset} (if applicable)`}
            id={`imgLink${index + offset}`}
            value={extraURLs[index] || ''}
            onChange={(e) => {
              let urls = [...extraURLs]
              urls[index] = e.target.value
              setExtraURLs(urls)
            }}
            disabled={disabled}
          />
        </InputGroup>
      )
  }

  const inputsNeeded = inputtingImage
    ? !!formData.url
      ? new Array(extraURLs.length + 1).fill(1)
      : []
    : new Array(nonImageInputs.length + 1).fill(1)

  const validLinks = nonImageInputs.filter((url) => !!url).length > 0
  const validExtraURLs = extraURLs.filter((url) => !!url)
  const validArtistPage = !!formData.artistPage
    ? validateURL(formData.artistPage)
    : true
  const validCanonicalURL = !!formData.canonicalURL
    ? validateURL(formData.canonicalURL)
    : true

  return (
    <Form id='art-input' onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Row>
          <Col md='6'>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>Title</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                placeholder='Image title (optional)'
                id='imgTitle'
                size='lg'
                value={formData.title || ''}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                disabled={disabled}
              />
            </InputGroup>
          </Col>
          <Col md='6'>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>Artist</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                placeholder='Artist name'
                id='imgArtist'
                size='lg'
                value={formData.artist || ''}
                onChange={(e) =>
                  setFormData({ ...formData, artist: e.target.value })
                }
                disabled={disabled}
              />
            </InputGroup>
            <LabelShrinkable valid={formData.artist ? true : false}>
              Artist required.
            </LabelShrinkable>
          </Col>
        </Form.Row>
      </Form.Group>

      <Form.Group>
        <Form.Row>
          <Col md='6' style={{ marginTop: 0 }}>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>Source</InputGroup.Text>
              </InputGroup.Prepend>
              <div className='input-group-text extra-fields-info'>
                Optional - Where the image was originally posted (Reddit,
                Tumblr, Discord, etc.)
              </div>
              <Form.Control
                placeholder='Canonical image link'
                id='imgCanonicalURL'
                size='lg'
                value={formData.canonicalURL || ''}
                onChange={(e) =>
                  setFormData({ ...formData, canonicalURL: e.target.value })
                }
                disabled={disabled}
              />
            </InputGroup>
            <LabelShrinkable valid={validCanonicalURL} error={true}>
              Invalid link.
            </LabelShrinkable>
          </Col>
          <Col md='6' style={{ marginTop: 0 }}>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>Artist Page</InputGroup.Text>
              </InputGroup.Prepend>
              <p className='input-group-text extra-fields-info'>
                Optional - Link to the artist's page, if one exists (Tumblr,
                DeviantArt profile, etc.)
              </p>
              <Form.Control
                placeholder='Artist page link'
                id='imgArtistPage'
                size='lg'
                value={formData.artistPage || ''}
                onChange={(e) =>
                  setFormData({ ...formData, artistPage: e.target.value })
                }
                disabled={disabled}
              />
            </InputGroup>
            <LabelShrinkable valid={validArtistPage} error={true}>
              Invalid link.
            </LabelShrinkable>
          </Col>
        </Form.Row>
      </Form.Group>

      <div className='input-group-text field-input-controls'>
        <Form.Check
          custom
          type='switch'
          id='nomineeIsNonImage'
          label='This nominee is not an image'
          checked={!inputtingImage}
          onChange={(e) => {
            if (!inputtingImage) {
              setFormData({ ...formData, nonImageArtInput: true })
            } else {
              let newFormData = { ...formData }
              if (newFormData.nonImageArtInput)
                delete newFormData.nonImageArtInput
              setFormData(newFormData)
            }
            setInputtingImage(!inputtingImage)
          }}
          disabled={disabled}
        />
      </div>

      <Form.Group>
        <InputGroup className='conjoined-inputs'>
          {inputtingImage ? (
            <>
              <InputGroup>
                {ImageInputLabel('image')}
                <Form.Control
                  size='lg'
                  placeholder='Image URL'
                  id='imgLink'
                  value={formData.url || ''}
                  onChange={(e) => {
                    setLoaded(false)
                    setFormData({ ...formData, url: e.target.value })
                  }}
                  disabled={disabled}
                />
              </InputGroup>
              {!!formData.url &&
                inputsNeeded.map((item, index) =>
                  createAdditionalInput(index, 'image')
                )}
              {/* <InputGroup.Append>
              <Button variant='dark' onClick={() => {}}>
              Upload
              </Button>
            </InputGroup.Append> */}
            </>
          ) : (
            inputsNeeded.map((item, index) =>
              createAdditionalInput(index, 'link', 1)
            )
          )}
        </InputGroup>
        <LabelShrinkable valid={!error && formData.url} error={error}>
          {inputtingImage &&
            (error ? 'Valid image required.' : 'Image required.')}
          {!inputtingImage &&
            (error ? 'Valid link required.' : 'Link required.')}
        </LabelShrinkable>
      </Form.Group>

      <div className='shrink-me'></div>

      <Form.Group className='text-center nominate-toggles'>
        <Form.Check
          custom
          type='switch'
          id='nomineeIsNSFW'
          label='This nominee contains explicit sexual content'
          checked={formData.nsfw || false}
          onChange={(e) => setFormData({ ...formData, nsfw: e.target.checked })}
          disabled={disabled}
        />
        <Form.Check
          custom
          type='switch'
          id='nomineeIsSpoiler'
          label='This nominee could be a spoiler'
          checked={formData.spoiler || false}
          onChange={(e) =>
            setFormData({ ...formData, spoiler: e.target.checked })
          }
          disabled={disabled}
        />
      </Form.Group>

      <div className='preview mx-auto'>
        {inputtingImage && !loaded && !error && formData.url && (
          <LoadingIndicator timeout={100} id='image-load'>
            <h5 className='text-muted'>Loading image...</h5>
          </LoadingIndicator>
        )}
        {inputtingImage && formData.url && (
          <PreviewCard
            type='art'
            onLoad={onLoad}
            onError={onError}
            formData={{ ...formData, extraImages: validExtraURLs }}
            hide={error || !loaded}
          />
        )}
        {!inputtingImage && (
          <PreviewCard
            type='fic'
            style={{ flexGrow: 1 }}
            fic={{
              ...formData,
              links: nonImageInputs,
              author: formData.artist,
              authorPage: formData.artistPage,
            }}
          />
        )}
      </div>
      <div
        className='text-muted text-center'
        style={{ marginTop: !inputtingImage ? '24px' : 0 }}
      >
        {inputtingImage &&
          (!formData.url || error) &&
          `Enter ${error ? 'a valid' : 'an'} image to continue.`}
        {!inputtingImage && 'Enter a link and artist to continue.'}
      </div>

      {formData.url && validExtraURLs.length > 0 && (
        <p
          style={{
            textAlign: 'center',
            fontStyle: 'italic',
            marginTop: '20px',
          }}
        >
          <strong>Note:</strong> this preview card only displays the first
          image.
        </p>
      )}

      <Submission
        tall
        disabled={
          disabled ||
          (inputtingImage
            ? !loaded || !formData.artist
            : !validLinks || !formData.artist)
        }
        text={extraFields ? 'Continue' : 'Submit'}
        submitting={submitting}
      />
    </Form>
  )
}

export default InputArt
