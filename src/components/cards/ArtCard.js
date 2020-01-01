import React from 'react'
import { Card } from 'react-bootstrap'

const ArtCard = ({ formData, onLoad, onError, className }) => {
  const classes = 'art-card' + (className ? ' ' + className : '')

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
          by <em>{formData.artist || 'Unknown'}</em>
        </Card.Subtitle>
      </Card.Body>
    </Card>
  )
}

export default ArtCard
