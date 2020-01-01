import React, { useState, useEffect } from 'react'
import { Form, InputGroup } from 'react-bootstrap'
import LabelShrinkable from '../util/LabelShrinkable'
import Submission from '../util/Submission'
import PreviewCard from '../cards/PreviewCard'

const InputOther = ({ fields }) => {
  const [formData, setFormData] = useState({})
  const [valid, setValid] = useState(false)

  //! needs support for:
  // - optional fields
  // - validation on images (like art input) and links (like fic input)
  const types = {}
  fields.forEach(field => (types[field.id] = field.name))

  useEffect(() => {
    const validateField = field =>
      formData[field.id] && formData[field.id].trim().length > 0
    setValid(
      fields.every(field => (field.optional ? true : validateField(field)))
    )
  }, [formData, fields])

  const handleSubmit = e => {
    e.preventDefault()
    console.log(formData)
  }

  return (
    <Form id='other-input' onSubmit={handleSubmit}>
      {fields.map(item => {
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
                onChange={e =>
                  setFormData({ ...formData, [item.id]: e.target.value })
                }
              />
            </InputGroup>
            {!item.optional && (
              <LabelShrinkable valid={formData[item.id]}>
                {item.text}
              </LabelShrinkable>
            )}
          </Form.Group>
        )
      })}

      <div id='preview' className='mx-auto'>
        {formData && (
          <PreviewCard
            data={formData}
            requiredTypes={types}
            className={Object.values(formData).length === 0 && 'd-none'}
            preview={true}
          />
        )}
      </div>

      <Submission tall disabled={!valid} />
    </Form>
  )
}

export default InputOther
