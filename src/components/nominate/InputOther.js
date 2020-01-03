import React, { useState, useEffect, useCallback } from 'react'
import { Form, InputGroup } from 'react-bootstrap'
import LoadingIndicator from '../util/LoadingIndicator'
import LabelShrinkable from '../util/LabelShrinkable'
import validateURL from '../../functions/validateURL'
import PreviewCard from '../cards/PreviewCard'
import Submission from '../util/Submission'

const InputOther = ({ fields }) => {
  const [formData, setFormData] = useState({})
  const [imgValid, setImgValid] = useState({})
  const [blurred, setBlurred] = useState({})
  const [valid, setValid] = useState({
    image: false,
    link: false,
    all: false
  })

  const types = {}
  fields.forEach(field => (types[field.id] = field.name))

  const validateField = useCallback(
    field => {
      let id = field.id
      if (id === 'link') return validateURL(formData.link)
      if (id === 'image')
        return imgValid.loaded && !imgValid.error ? true : false
      return formData[id] && formData[id].trim().length > 0 ? true : false
    },
    [formData, imgValid]
  )

  useEffect(() => {
    setValid(fields.every(field => field.optional || validateField(field)))
  }, [fields, validateField])

  const handleSubmit = e => {
    e.preventDefault()
    console.log(formData)
  }

  const onLoad = () => {
    setImgValid({
      error: false,
      loaded: true
    })
  }

  const onError = () => {
    setImgValid({
      error: true,
      loaded: true
    })
  }

  const blur = field => {
    if (!blurred[field]) setBlurred({ ...blurred, [field]: true })
  }

  const getLabelText = (field, validated) => {
    let id = field.id
    let isFilled = formData[id] ? true : false
    if (id === 'image' && !imgValid.loaded && isFilled)
      return (
        <LoadingIndicator
          className='inline-load'
          spinnerProps={{ width: '8px', height: '8px', margin: '0' }}
          noRise={true}
        >
          Loading image...
        </LoadingIndicator>
      )
    if (!validated && isFilled) return `Invalid ${id}.`
    return field.text
  }

  return (
    <Form id='other-input' onSubmit={handleSubmit}>
      {fields.map(item => {
        const validated = validateField(item)
        return (
          <Form.Group key={item.id}>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>{item.name}</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                placeholder={
                  item.placeholder
                    ? item.placeholder
                    : `Enter ${item.name.toLowerCase()} here`
                }
                id={item.id}
                size='lg'
                onChange={e => {
                  setFormData({ ...formData, [item.id]: e.target.value })
                  if (item.id === 'image')
                    setImgValid({ error: false, loaded: false })
                }}
                onBlur={e => blur(item.id)}
              />
            </InputGroup>
            {(!item.optional || !validated) && (
              <LabelShrinkable
                valid={formData[item.id] && validated}
                error={blurred[item.id] && !validated}
              >
                {getLabelText(item, validated)}
              </LabelShrinkable>
            )}
          </Form.Group>
        )
      })}

      <div id='preview' className='mx-auto'>
        {formData && (
          <PreviewCard
            data={
              formData.link && !validateField({ id: 'link' })
                ? { ...formData, link: '#no-link' }
                : formData
            }
            requiredTypes={types}
            hide={Object.values(formData).length === 0 || imgValid.error}
            onLoad={onLoad}
            onError={onError}
          />
        )}
      </div>

      <Submission tall disabled={!valid} />
    </Form>
  )
}

export default InputOther
