import React from 'react'
import FicLinks from '../cards/FicLinks'
import getMapOfValues from '../../functions/getMapOfValues'

const Result = ({
  entry,
  entryKey,
  category,
  type,
  votePercentage = null,
  votedFor,
}) => {
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
  const image = type === 'art' ? entry.url : entry.image
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
      {blur && image && (
        <>
          {indicator}
          <p className='hover-to-reveal'>Mouseover to reveal.</p>
        </>
      )}
      {entry?.extraURLs?.length > 0 && (
        <p className='hover-to-reveal'>Click to view additional images.</p>
      )}
      {image && (
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
              className={blur ? 'nsfw-img result-img' : 'result-img'}
              alt={`Entry ${entry.id}`}
            />
          </div>
        </div>
      )}
      {entry?.links?.length > 0 && <FicLinks links={entry.links} />}
      {blur && !image && title && indicator}
      {votedFor && <h6 className='voted-for'>You voted for this.</h6>}
      {votePercentage}
    </div>
  )
}

export default Result
