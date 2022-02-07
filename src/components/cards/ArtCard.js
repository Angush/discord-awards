import React from 'react'
import { Card } from 'react-bootstrap'
import validateURL from '../../functions/validateURL'
import YouTubeEmbed from './embeds/YouTubeEmbed'

const getEmbed = (url, data) => {
  let match
  match = url.match(/(youtube.com\/watch\?v=|youtu.be\/)(?<id>\w+)/)
  if (match?.groups?.id) return <YouTubeEmbed id={match.groups.id} />
}

const ArtCard = ({
  formData,
  onClick,
  onLoad,
  onError,
  className,
  selected,
}) => {
  const classes = 'art-card' + (className ? ' ' + className : '')
  const props = !onClick
    ? {}
    : {
        keyclickable: 'true',
        onClick: onClick,
        tabIndex: 0,
      }
  const dataName = validateURL(formData.artistPage) ? (
    <>
      by{' '}
      <Card.Link
        href={formData.artistPage}
        target='_blank'
        rel='noopener noreferrer'
      >
        <em>{formData.artist || 'Unknown'}</em>
      </Card.Link>
    </>
  ) : (
    <>
      by <em>{formData.artist || 'Unknown'}</em>
    </>
  )
  const dataTitle = validateURL(formData.canonicalURL) ? (
    <Card.Link
      href={formData.canonicalURL}
      target='_blank'
      rel='noopener noreferrer'
    >
      {formData.title || 'Untitled'}
    </Card.Link>
  ) : (
    formData.title || 'Untitled'
  )

  const Embed = getEmbed(formData.url || formData?.links?.[0])

  return (
    <Card
      bg={selected ? 'primary' : 'dark'}
      text='white'
      className={classes}
      {...props}
    >
      <div className='card-img-parent'>
        {Embed || (
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
        )}
      </div>
      <Card.Body>
        {formData?.extraImages?.length > 0 && (
          <span className='extra-images-indicator'>
            +{formData.extraImages.length} images
          </span>
        )}
        {formData.nsfw && <span className='nsfw-indicator'>NSFW</span>}
        {formData.spoiler && (
          <span className='nsfw-indicator spoiler-indicator'>SPOILER</span>
        )}
        <Card.Title>{dataTitle}</Card.Title>
        <Card.Subtitle>{dataName}</Card.Subtitle>
      </Card.Body>
    </Card>
  )
}

export default ArtCard
