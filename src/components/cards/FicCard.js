import React from 'react'
import { Card } from 'react-bootstrap'
import getMapOfValues from '../../functions/getMapOfValues'
import FicLinks from './FicLinks'

const FicCard = ({ fic, className, onClick, selected, contest }) => {
  const classes = 'fic-card' + (className ? ' ' + className : '')
  const props = !onClick
    ? {}
    : {
        keyclickable: 'true',
        onClick: onClick,
        tabIndex: 0,
      }
  const ficTitle = fic.title || 'Untitled'

  // TODO: support for computed values
  // TODO: also support for prefixes/suffixes

  const values = contest?.fields ? getMapOfValues(contest, fic) : new Map()

  return (
    <Card
      bg={selected ? 'primary' : 'dark'}
      text='white'
      className={classes}
      {...props}
    >
      {values.has('name') && (
        <Card.Header className='fic-name-field'>
          <Card.Title>
            {fic.nsfw && <span className='nsfw-indicator'>NSFW</span>}
            {fic.link ? (
              <Card.Link
                href={fic.link}
                target='_blank'
                rel='noopener noreferrer'
              >
                {values.get('name')}
              </Card.Link>
            ) : (
              values.get('name')
            )}
          </Card.Title>
        </Card.Header>
      )}
      <Card.Body>
        {values.has('name') ? (
          <Card.Subtitle>
            in {fic.author || 'Unknown'}'s <em>{ficTitle}</em>
          </Card.Subtitle>
        ) : (
          <>
            <Card.Title>
              {fic.nsfw && <span className='nsfw-indicator'>NSFW</span>}
              {fic.link && !values.has('name') ? (
                <Card.Link
                  href={fic.link}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  {ficTitle}
                </Card.Link>
              ) : (
                ficTitle
              )}
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
        {(fic.description || values.has('description')) && (
          <Card.Text className='fic-description-field'>
            {fic.description || values.get('description')}
          </Card.Text>
        )}
        <FicLinks links={fic.links} />
      </Card.Body>
    </Card>
  )
}

export default FicCard
