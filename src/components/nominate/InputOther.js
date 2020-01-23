import React, { useState, useEffect, useCallback } from 'react'
import { Form, InputGroup } from 'react-bootstrap'
import LoadingIndicator from '../util/LoadingIndicator'
import LabelShrinkable from '../util/LabelShrinkable'
import validateURL from '../../functions/validateURL'
import PreviewCard from '../cards/PreviewCard'
import Submission from '../util/Submission'

const InputOther = ({ category, save, disabled, submitting }) => {
  const [formData, setFormData] = useState({})
  const [imgValid, setImgValid] = useState({})
  const [blurred, setBlurred] = useState({})
  const [valid, setValid] = useState({
    image: false,
    link: false,
    all: false
  })

  const types = {}
  category.fields.forEach(field => (types[field.id] = field.name))

  const validateField = useCallback(
    field => {
      let id = field.id
      if (field.optional && !formData[id]) return true
      if (id === 'link') return validateURL(formData.link)
      if (id === 'image')
        return imgValid.loaded && !imgValid.error ? true : false
      return formData[id] && formData[id].trim().length > 0 ? true : false
    },
    [formData, imgValid]
  )

  useEffect(() => {
    setValid(category.fields.every(field => validateField(field)))
  }, [category.fields, validateField])

  const handleSubmit = e => {
    e.preventDefault()
    save(formData)
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
      {category.fields.map(item => {
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
                disabled={disabled}
              />
            </InputGroup>
            <LabelShrinkable
              valid={formData[item.id] && validated}
              error={blurred[item.id] && !validated}
              optional={item.optional}
            >
              {getLabelText(item, validated)}
            </LabelShrinkable>
          </Form.Group>
        )
      })}

      <div className='preview mx-auto'>
        {Object.values(formData).filter(v => v).length > 0 ? (
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
        ) : (
          <span className='text-muted '>
            Enter the required data to submit.
          </span>
        )}
      </div>

      <Submission tall disabled={!valid || disabled} submitting={submitting} />
    </Form>
  )
}

export default InputOther
