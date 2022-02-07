import React, { useState } from 'react'
import { Card } from 'react-bootstrap'
import validateURL from '../../functions/validateURL'
import GenericVideoEmbed from './embeds/GenericVideoEmbed'
import YouTubeEmbed from './embeds/YouTubeEmbed'
import FicLinks from './FicLinks'

const getEmbed = (url, data) => {
  const title = `(${data.id}) ${data.title || 'Untitled'} by ${
    data.artist || 'Unknown'
  }`
  let match
  match = url.match(/(youtube.com\/watch\?v=|youtu.be\/)(?<id>\w+)/)
  if (match?.groups?.id)
    return <YouTubeEmbed id={match.groups.id} title={title} />
  if (url.match(/redd\.it.+format=mp4/))
    return <GenericVideoEmbed url={url} title={title} />
}

const ArtCard = ({
  formData,
  onClick,
  onLoad,
  onError = null,
  className,
  selected,
}) => {
  const [error, setError] = useState(false)

  const classes =
    'art-card' +
    (error && (formData.nsfw || formData.spoiler) ? ' error-card' : '') +
    (className ? ' ' + className : '')
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
  const dataURL =
    formData.url ||
    formData?.extraURLs?.find((url) => !!url) ||
    formData?.links?.find((url) => !!url)

  const Embed = getEmbed(dataURL, formData)

  const ifInvalidImage = () => setError(true)

  return (
    <Card
      bg={selected ? 'primary' : 'dark'}
      text='white'
      className={classes}
      {...props}
    >
      <div className='card-img-parent'>
        {Embed ||
          (!error && (
            <Card.Img
              onLoad={onLoad}
              onError={onError || ifInvalidImage}
              src={dataURL}
              alt={formData.identifier}
              id={formData.key}
              className={(formData.nsfw || formData.spoiler) && 'nsfw-img'}
              // height={400 * (formData.height / formData.width)}
              // width={400}
              // loading='lazy'
            />
          ))}
      </div>
      <Card.Body>
        {formData?.extraURLs?.length > 0 && (
          <span className='extra-images-indicator'>
            +{formData.extraURLs.length} images
          </span>
        )}
        <div
          className={'card-indicators' + (error ? ' bottom-indicators' : '')}
        >
          {formData.nsfw && <span className='nsfw-indicator'>NSFW</span>}
          {formData.spoiler && (
            <span className='nsfw-indicator spoiler-indicator'>SPOILER</span>
          )}
        </div>
        <Card.Title>{dataTitle}</Card.Title>
        <Card.Subtitle>{dataName}</Card.Subtitle>
        {error && (
          <Card.Text className='fic-description-field'>
            This artwork could not be embedded; please use the link
            {formData?.links?.length > 1 ? 's' : ''} below.
          </Card.Text>
        )}
        {formData.links && <FicLinks links={formData.links} />}
      </Card.Body>
    </Card>
  )
}

export default ArtCard
