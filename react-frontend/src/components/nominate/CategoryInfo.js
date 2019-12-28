import React from 'react'
import { navigate } from '@reach/router'
import { Card } from 'react-bootstrap'

const CategoryInfo = ({ data: { id, name, description }, hidden }) => {
  let props = !hidden && {
    className: 'enabled-card',
    onClick: e => {
      e.preventDefault()
      navigate(`/nominate/${id}`)
    },
    tabIndex: 0,
    'keyboard-clickable': 'true'
  }

  return (
    <Card {...props}>
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text>{description}</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default CategoryInfo
