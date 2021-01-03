import React, { useState, useEffect, useCallback } from 'react'
import { Form, InputGroup } from 'react-bootstrap'
import LoadingIndicator from '../util/LoadingIndicator'
import LabelShrinkable from '../util/LabelShrinkable'
import validateURL from '../../functions/validateURL'
import PreviewCard from '../cards/PreviewCard'
import Submission from '../util/Submission'

const InputOther = ({
  category, save, disabled, submitting, nominee, setNominee = null,
  inline = false, setExtraData = null, updateValidity = null, currentValidity = null
}) => {
  const [refilledData, setRefilledData] = useState(inline)
  const [formData, setFormData] = useState({})
  const [imgValid, setImgValid] = useState({}) // TODO: add "display:none" image cards to do image validity for inline inputs, as currently it won't know whether an image is valid or not. HOWEVER: this isn't relevant at the moment, since I'm not planning to do any custom fic category fields that require images; all I really need are names and descriptions, I think.
  const [blurred, setBlurred] = useState({})
  const [valid, setValid] = useState(false)

  useEffect(() => {
    if (refilledData) return
    if (category.id === nominee.categoryId) {
      setFormData(nominee.data)
      setRefilledData(true)
    }
  }, [nominee, category, refilledData])

  useEffect(() => {
    if (!setNominee) return

    let newData = {}
    if (Object.values(formData).length > 0) newData = { ...formData }
    setNominee({ categoryId: category.id, data: newData })
  }, [formData, category, setNominee])

  useEffect(() => {
    if (!updateValidity || currentValidity === valid || currentValidity === null) return
    updateValidity(valid)
  }, [valid, currentValidity, updateValidity])

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
    let newValidityStatus = category.fields.every(field => validateField(field))
    setValid(newValidityStatus)
  }, [category.fields, validateField, updateValidity])

  const handleSubmit = e => {
    e.preventDefault()
    save(formData)
  }

  const onLoad = () => setImgValid({ error: false, loaded: true })
  const onError = () => setImgValid({ error: true, loaded: true })

  const blur = field => {
    if (!blurred[field]) setBlurred({ ...blurred, [field]: true })
    if (inline) setExtraData(formData)
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


  const createFormElement = item => {
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
            // id={item.id}
            size='lg'
            value={formData[item.id] || ''}
            onChange={e => {
              setFormData({ ...formData, [item.id]: e.target.value })
              if (item.id === 'image') setImgValid({ error: false, loaded: false })
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
  }

  if (inline) return (
    <div className='extra-field-input'>
      <h5>{category.name}</h5>
      <p>{category.description}</p>
      {category.fields.map(createFormElement)}
    </div>
  )

  return (
    <Form className='other-input' onSubmit={handleSubmit}>
      {category.fields.map(createFormElement)}

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

      <Submission
        tall
        disabled={!valid || disabled}
        submitting={submitting}
      />
    </Form>
  )
}

export default InputOther
