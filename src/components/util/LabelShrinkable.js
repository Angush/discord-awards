import React from 'react'
import { Form } from 'react-bootstrap'

const LabelShrinkable = ({ valid, error, children, style, className }) => {
  const classes = `shrink-me ${className || ''} ${
    valid ? 'label-invisible' : ''
  } ${error ? 'label-error' : ''}`
  return (
    <Form.Text className={classes} style={style}>
      {children || 'Required.'}
    </Form.Text>
  )
}

export default LabelShrinkable
