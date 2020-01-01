import React from 'react'
import { Card } from 'react-bootstrap'

const OtherCard = ({
  data: { name, link, description, owner, image },
  single = false,
  className
}) => {
  const classes =
    'other-card' +
    (single ? ' single-field-card' : '') +
    (className ? ` ${className}` : '')

  return (
    <Card bg='dark' text='white' className={classes}>
      <Card.Body>
        {(name || link) && (
          <Card.Title>
            {link ? (
              <Card.Link href={link} target='_blank' rel='noopener noreferrer'>
                {name ? name : link}
              </Card.Link>
            ) : (
              name
            )}
          </Card.Title>
        )}
        {owner && <Card.Subtitle>{owner}</Card.Subtitle>}
        {description && <Card.Text>{description}</Card.Text>}
      </Card.Body>
      {image && <Card.Img src={image} variant='bottom' />}
    </Card>
  )
}

export default OtherCard
