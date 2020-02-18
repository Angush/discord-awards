import React from 'react'
import { Card } from 'react-bootstrap'
import FicLinks from './FicLinks'

const FicCard = ({ fic, className }) => {
  const classes = 'fic-card' + (className ? ' ' + className : '')

  return (
    <Card bg='dark' text='white' className={classes}>
      <Card.Body>
        <Card.Title>
          {fic.nsfw && <span className='nsfw-indicator'>NSFW</span>} {fic.title}
        </Card.Title>
        <Card.Subtitle>
          by <em>{fic.author}</em>
        </Card.Subtitle>
        {fic.links ? <FicLinks links={fic.links} /> : 'No links.'}
      </Card.Body>
    </Card>
  )
}

export default FicCard
