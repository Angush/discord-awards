import React from 'react'
import { Card } from 'react-bootstrap'

const DEFAULT_LINK = '#no-link'
const DEFAULT_IMG = '/images/noimage.png'

const OtherCard = ({
  data: { name, link, description, owner, image, identifier, key },
  imageOnly = false,
  single = false,
  className,
  onClick,
  onLoad,
  onError,
  selected,
  contest,
}) => {
  const classes =
    'other-card' +
    (single ? ' single-field-card' : '') +
    (className ? ` ${className}` : '') +
    (imageOnly ? ' img-only-card' : '')
  const linkProps =
    link === DEFAULT_LINK
      ? {}
      : { target: '_blank', rel: 'noopener noreferrer' }
  const imgProps = image === DEFAULT_IMG ? {} : { onLoad, onError }
  const props = !onClick
    ? {}
    : {
        keyclickable: 'true',
        onClick: onClick,
        tabIndex: 0,
      }

  // TODO: support for computed values
  // TODO: also support for prefixes/suffixes

  return (
    <Card
      bg={selected ? 'primary' : 'dark'}
      text='white'
      className={classes}
      {...props}
    >
      {!imageOnly && (
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
      )}
      {image && (
        <div className='card-img-parent'>
          <Card.Img
            id={key}
            src={image}
            variant='bottom'
            alt={identifier}
            {...imgProps}
            className={imageOnly ? 'non-expandable-img' : ''}
          />
        </div>
      )}
    </Card>
  )
}

export default OtherCard
