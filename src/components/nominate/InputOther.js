import React, { useState, useEffect } from 'react'
import { Form, InputGroup } from 'react-bootstrap'
import Submission from '../util/Submission'

const InputOther = ({ fields }) => {
  const [formData, setFormData] = useState({})
  const [valid, setValid] = useState(false)

  useEffect(() => {
    const validateField = field =>
      formData[field.id] && formData[field.id].trim().length > 0
    setValid(
      fields.every(field => (field.optional ? true : validateField(field)))
    )
  }, [formData, fields])

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
    <Form id='other-input' onSubmit={handleSubmit}>
      {fields.map(item => {
        return (
          <Form.Group key={item.id}>
            <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text>{item.name}</InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                placeholder={item.placeholder}
                id={item.id}
                size='lg'
                onChange={e =>
                  setFormData({ ...formData, [item.id]: e.target.value })
                }
              />
            </InputGroup>
            {item.text && (
              <>
                <Form.Text>{item.text}</Form.Text>
                <div className='shrink-me'></div>
              </>
            )}
          </Form.Group>
        )
      })}

      <Submission tall disabled={!valid} />
    </Form>
  )
}

export default InputOther
