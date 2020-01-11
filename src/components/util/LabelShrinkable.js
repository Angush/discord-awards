import React from 'react'
import { Form } from 'react-bootstrap'

const LabelShrinkable = ({
  valid,
  error,
  style,
  children,
  className,
  optional
}) => {
  const classes = `shrink-me ${className || ''} ${
    valid ? 'label-invisible' : ''
  } ${error ? 'label-error' : ''}`.replace(/\s+/, ' ')
  return (
    <Form.Text className={classes} style={style}>
      {children || (optional ? '' : 'Required.')}
    </Form.Text>
  )
}

export default LabelShrinkable
