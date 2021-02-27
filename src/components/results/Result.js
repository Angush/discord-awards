import React from 'react'
import FicLinks from '../cards/FicLinks'

const Result = ({ entry, type, votePercentage = null, votedFor }) => {
  const title = entry.name || entry.title
  const creator = (entry.name && entry.title) ? `in ${entry.author}'s ${entry.title}` : (entry.author || entry.artist || entry.owner)
  const image = type === 'art' ? entry.url : entry.image
  const link = entry.canonicalURL || entry.url || entry.link
  const desc = entry.description
  const blur = entry.spoiler || entry.nsfw
  const creatorPage = entry.artistPage || null

  const indicator =
    entry.nsfw && entry.spoiler ? (
      <p className='result-indicator'>
        <span>NSFW</span> + <span>SPOILER</span>
      </p>
    ) : (
      <>
        {entry.nsfw && (
          <p className='result-indicator'>
            <span>NSFW</span>
          </p>
        )}
        {entry.spoiler && (
          <p className='result-indicator'>
            <span>SPOILER</span>
          </p>
        )}
      </>
    )

  return (
    <div className='result'>
      {title && (
        <h4>
          {link ? <a href={link} target='_blank' rel='noreferrer noopener'>{title}</a> : title}{' '}
          {blur && !image && title && indicator}
        </h4>
      )}
      {creator && creatorPage && (
        <h5 className='creator-page-link'>
          <a href={creatorPage} target='_blank' rel='noreferrer noopener'>{creator}</a>
        </h5>
      )}
      {creator && !creatorPage && <h5>{creator}</h5>}
      {desc && <h6 className='result-desc'>{desc}</h6>}
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
      {type === 'fic' && <FicLinks links={entry.links} />}
      {votedFor && <h6 className='voted-for'>You voted for this.</h6>}
      {votePercentage}
    </div>
  )
}

export default Result
