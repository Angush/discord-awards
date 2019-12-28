import React from 'react'
import { Card } from 'react-bootstrap'

const CategoryInfo = ({ data, selected, hidden, onClick }) => {
  let classes = selected ? 'selected-card ' : ''
  let props = hidden
    ? { className: classes }
    : {
        className: classes + 'enabled-card',
        onClick: onClick,
        tabIndex: 0,
        'keyboard-clickable': 'true'
      }

  return (
    <Card {...props}>
      <Card.Body>
        <Card.Title>{data.name}</Card.Title>
        <Card.Text>{data.description}</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default CategoryInfo
