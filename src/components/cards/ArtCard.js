import React from 'react'
import { Card } from 'react-bootstrap'

const ArtCard = ({ formData, onLoad, onError, className }) => {
  const classes = 'art-card' + (className ? ' ' + className : '')
  const artistInfo = (
    <>
      by <em>{formData.artist || 'Unknown'}</em>
    </>
  )
  return (
    <Card bg='dark' text='white' className={classes}>
      <div className='card-img-parent'>
        <Card.Img
          src={formData.url}
          alt='Preview of your nomination'
          onLoad={onLoad}
          onError={onError}
          className={formData.nsfw && 'nsfw-img'}
        />
      </div>
      <Card.Body>
        {formData.nsfw && <span className='nsfw-indicator'>NSFW</span>}
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
