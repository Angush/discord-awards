import React from 'react'
import FicLinks from '../cards/FicLinks'

const Result = ({ entry, type, votePercentage = null, votedFor }) => {
  const title = entry.title || entry.name
  const creator = entry.author || entry.artist || entry.owner
  const image = type === 'art' ? entry.url : entry.image
  const link = entry.url || entry.link
  const desc = entry.description
  const blur = entry.spoiler || entry.nsfw

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
          {link ? <a href={link}>{title}</a> : title}{' '}
          {blur && !image && title && indicator}
        </h4>
      )}
      {creator && <h5>{creator}</h5>}
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
