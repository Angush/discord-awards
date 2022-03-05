import React from 'react'
import FicLinks from '../cards/FicLinks'
import getMapOfValues from '../../functions/getMapOfValues'

const Result = ({ entry, category, type, votePercentage = null, votedFor }) => {
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
      {image && (
        <div className='img-parent'>
          <a href={image} target='_blank' rel='noreferrer noopener'>
            <img
              src={image}
              loading='lazy'
              className={blur ? 'nsfw-img' : ''}
              alt={`Entry ${entry.id}`}
            />
          </a>
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
