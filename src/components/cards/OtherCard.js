import React from 'react'
import { Card } from 'react-bootstrap'

const DEFAULT_LINK = '#no-link'
const DEFAULT_IMG = '/images/noimage.png'

const OtherCard = ({
  data: { name, link, description, owner, image },
  single = false,
  className,
  onLoad,
  onError
}) => {
  const classes =
    'other-card' +
    (single ? ' single-field-card' : '') +
    (className ? ` ${className}` : '')
  const linkProps =
    link === DEFAULT_LINK
      ? {}
      : { target: '_blank', rel: 'noopener noreferrer' }
  const imgProps = image === DEFAULT_IMG ? {} : { onLoad, onError }

  return (
    <Card bg='dark' text='white' className={classes}>
      <Card.Body>
        {(name || link) && (
          <Card.Title>
            {link ? (
              <Card.Link href={link} {...linkProps}>
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
      {image && <Card.Img src={image} variant='bottom' {...imgProps} />}
    </Card>
  )
}

export default OtherCard
