import React from 'react'
import { Card } from 'react-bootstrap'
import FicLinks from './FicLinks'

const FicCard = ({ fic, className, onClick, selected }) => {
  const classes = 'fic-card' + (className ? ' ' + className : '')
  const props = !onClick
    ? {}
    : {
        keyclickable: 'true',
        onClick: onClick,
        tabIndex: 0,
      }
  const ficTitle = fic.title || 'Untitled'

  return (
    <Card
      bg={selected ? 'primary' : 'dark'}
      text='white'
      className={classes}
      {...props}
    >
      {fic.name && (
        <Card.Header className='fic-name-field'>
          <Card.Title>
            {fic.nsfw && <span className='nsfw-indicator'>NSFW</span>}
            {fic.name}
          </Card.Title>
        </Card.Header>
      )}
      <Card.Body>
        {fic.name ? (
          <Card.Subtitle>
            in {fic.author || 'Unknown'}'s <em>{ficTitle}</em>
          </Card.Subtitle>
        ) : (
          <>
            <Card.Title>
              {fic.nsfw && <span className='nsfw-indicator'>NSFW</span>}
              {ficTitle}
            </Card.Title>
            <Card.Subtitle>
              by{' '}
              {fic.authorPage || fic.artistPage ? (
                <em>
                  <Card.Link
                    href={fic.authorPage || fic.artistPage}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {fic.author || 'Unknown'}
                  </Card.Link>
                </em>
              ) : (
                <em>{fic.author || 'Unknown'}</em>
              )}
            </Card.Subtitle>
          </>
        )}
        {fic.description && (
          <Card.Text className='fic-description-field'>
            {fic.description}
          </Card.Text>
        )}
        <FicLinks links={fic.links} />
      </Card.Body>
    </Card>
  )
}

export default FicCard
