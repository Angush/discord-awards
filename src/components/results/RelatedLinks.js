import React from 'react'
import FicLinks from '../cards/FicLinks'

const RelatedLinks = ({
  type: categoryType,
  links,
  creator,
  heading = `Some of ${creator}'s works include...`,
  title = `Works`,
}) => {
  return (
    <details className='category-description related-links-container'>
      <summary>{title}</summary>
      <p className='links-text'>{heading}</p>
      <ol className='related-links'>
        {links.map(l => {
          if (l.image)
            return (
              <li className='image-link'>
                <p>
                  <a
                    href={l.link || l.image}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {l.title}
                  </a>
                </p>
                <div>
                  <img src={l.image} alt={l.title} className='result-img' />
                </div>
              </li>
            )

          if (Array.isArray(l.links))
            return (
              <li className='many-links'>
                <p>{l.title}</p>
                <FicLinks links={l.links} />
              </li>
            )

          if (l.link)
            return (
              <li className='one-link'>
                <a href={l.link} target='_blank' rel='noopener noreferrer'>
                  {l.title}
                </a>
              </li>
            )

          return <li className='one-link'>{l.title}</li>
        })}
      </ol>
    </details>
  )
}

export default RelatedLinks
