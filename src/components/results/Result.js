import React, { useState } from 'react'
import FicLinks from '../cards/FicLinks'
import getMapOfValues from '../../functions/getMapOfValues'
import getEmbed from '../../functions/getEmbed'

const Result = ({
  entry,
  entryKey,
  category,
  type,
  votePercentage = null,
  votedFor,
}) => {
  const [error, setError] = useState(false)
  const ifInvalidImage = () => setError(true)

  const hiddenFields = {}
  if (category.fields)
    category.fields.forEach(field => {
      if (field.hidden) hiddenFields[field.id] = true
    })
  const hasMultipleOwners =
    entry.owner &&
    (entry.artist || entry.author) &&
    (entry.title || entry.name) &&
    !hiddenFields['owner'] &&
    !hiddenFields['name']
  const title = hasMultipleOwners
    ? entry.title || entry.name
    : hiddenFields['name']
    ? entry.title
    : entry.name || entry.title
  const creator = hasMultipleOwners ? (
    <>
      by {entry.artist || entry.author}
      <br />
      for {entry.owner}'s
      <br />
      <em>{entry.name || entry.title}</em>
    </>
  ) : entry.name && entry.title && !hiddenFields['name'] ? (
    <>
      in {entry.author || entry.artist || entry.owner}'s
      <br />
      <em>{entry.title}</em>
    </>
  ) : (
    entry.author || entry.artist || entry.owner
  )
  const link = entry.canonicalURL || entry.url || entry.link
  const desc = entry.description
  const blur = entry.spoiler || entry.nsfw
  const creatorPage = entry.artistPage || null

  const indicator = (entry.nsfw || entry.spoiler) && (
    <p className='result-indicator'>
      {entry.nsfw && <span className='nsfw-indicator'>NSFW</span>}
      {entry.spoiler && <span className='spoiler-indicator'>SPOILER</span>}
    </p>
  )

  const values = category?.fields ? getMapOfValues(category, entry) : new Map()
  const image =
    type === 'fic'
      ? null
      : entry.url ||
        entry.image ||
        entry?.extraURLs?.find(url => !!url) ||
        entry?.links?.find(url => !!url)

  const Embed = getEmbed(image, entry)
  const nonEmbedLinks = entry?.links || []
  const filteredLinks = Embed
    ? nonEmbedLinks.filter(url => url !== image)
    : nonEmbedLinks

  return (
    <div className='result'>
      {title && (
        <h4>
          {link ? (
            <a href={link} target='_blank' rel='noreferrer noopener'>
              {title}
            </a>
          ) : (
            title
          )}{' '}
        </h4>
      )}
      {creator && creatorPage && (
        <h5 className='creator-page-link'>
          <a href={creatorPage} target='_blank' rel='noreferrer noopener'>
            {creator}
          </a>
        </h5>
      )}
      {creator && !creatorPage && <h5>{creator}</h5>}
      {(desc || values.has('description')) && (
        <h6 className='result-desc'>{desc || values.get('description')}</h6>
      )}
      {!Embed && image && error && (
        <div>
          This artwork could not be embedded; please use the link
          {nonEmbedLinks.length > 1 ? 's' : ''} below.
        </div>
      )}
      {blur && image && (
        <>
          {indicator}
          {!error && !Embed && (
            <p className='hover-to-reveal'>Mouseover to reveal.</p>
          )}
        </>
      )}
      {entry?.extraURLs?.length > 0 && !error && (
        <p className='hover-to-reveal'>Click to view additional images.</p>
      )}
      {!!Embed && Embed}
      {!Embed && image && !error && (
        <div className='img-parent'>
          <div>
            {entry?.extraURLs?.length > 0 && (
              <span className='extra-images-indicator'>
                +{entry.extraURLs.length} images
              </span>
            )}
            <img
              id={entryKey}
              src={image}
              loading='lazy'
              onError={ifInvalidImage}
              className={blur ? 'nsfw-img result-img' : 'result-img'}
              alt={`Entry ${entry.id}`}
            />
          </div>
        </div>
      )}
      {!error && filteredLinks.length > 0 && <FicLinks links={filteredLinks} />}
      {error && nonEmbedLinks.length > 0 && <FicLinks links={nonEmbedLinks} />}
      {blur && !image && title && indicator}
      {votedFor && <h6 className='voted-for'>You voted for this.</h6>}
      {votePercentage}
    </div>
  )
}

export default Result
