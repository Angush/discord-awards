import React from 'react'
import { Card } from 'react-bootstrap'

const SelectableCard = ({
  children,
  selected,
  hidden,
  onClick,
  selectedProps
}) => {
  const classes = selected ? 'selected-card ' : ''
  const cardProps = hidden
    ? { className: classes }
    : {
        className: classes + 'enabled-card',
        keyclickable: 'true',
        onClick: onClick,
        tabIndex: 0
      }

  if (!selectedProps)
    selectedProps = !selected
      ? {}
      : {
          bg: 'primary',
          text: 'white'
        }

  return (
    <Card {...cardProps} {...selectedProps}>
      {children}
    </Card>
  )
}

export default SelectableCard
