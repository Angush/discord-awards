import React from 'react'
import { Card } from 'react-bootstrap'

const ArtCard = ({
  formData,
  onClick,
  onLoad,
  onError,
  className,
  selected
}) => {
  const classes = 'art-card' + (className ? ' ' + className : '')
  const props = !onClick
    ? {}
    : {
        keyclickable: 'true',
        onClick: onClick,
        tabIndex: 0
      }
  const artistInfo = (
    <>
      by <em>{formData.artist || 'Unknown'}</em>
    </>
  )

  return (
    <Card
      bg={selected ? 'primary' : 'dark'}
      text='white'
      className={classes}
      {...props}
    >
      <div className='card-img-parent'>
        <Card.Img
          onLoad={onLoad}
          onError={onError}
          src={formData.url}
          alt={formData.identifier}
          id={formData.key}
          className={(formData.nsfw || formData.spoiler) && 'nsfw-img'}
          // height={400 * (formData.height / formData.width)}
          // width={400}
          // loading='lazy'
        />
      </div>
      <Card.Body>
        {formData.nsfw && <span className='nsfw-indicator'>NSFW</span>}
        {formData.spoiler && (
          <span className='nsfw-indicator spoiler-indicator'>SPOILER</span>
        )}
        <Card.Title>{formData.title || 'Untitled'}</Card.Title>
        <Card.Subtitle>
          {formData.artistURL ? (
            <Card.Link
              href={formData.artistURL}
              target='_blank'
              rel='noopener noreferrer'
            >
              {artistInfo}
            </Card.Link>
          ) : (
            artistInfo
          )}
        </Card.Subtitle>
      </Card.Body>
    </Card>
  )
}

export default ArtCard
