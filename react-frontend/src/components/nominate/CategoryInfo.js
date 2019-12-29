import React from 'react'
import { Card } from 'react-bootstrap'

const CategoryInfo = props => {
  const { data, selected, hidden, onClick } = props
  const classes = selected ? 'selected-card ' : ''
  const cardProps = hidden
    ? { className: classes }
    : {
        className: classes + 'enabled-card',
        onClick: onClick,
        tabIndex: 0,
        keyclickable: 'true'
      }

  return (
    <Card {...cardProps}>
      <Card.Body>
        <Card.Title>{data.name}</Card.Title>
        <Card.Text>{data.description}</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default CategoryInfo
