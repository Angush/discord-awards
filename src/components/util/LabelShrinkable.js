import React from 'react'
import { Form } from 'react-bootstrap'

const LabelShrinkable = ({ valid, children, style, className }) => {
  const classes = `shrink-me ${className} ${valid ? 'invisible' : ''}`
  return (
    <Form.Text className={classes} style={style}>
      {children || 'Required.'}
    </Form.Text>
  )
}

export default LabelShrinkable
