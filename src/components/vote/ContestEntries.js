import React from 'react'
import Masonry from 'react-masonry-css'
import OtherCard from '../cards/OtherCard'
import FicCard from '../cards/FicCard'
import ArtCard from '../cards/ArtCard'

const ContestEntries = ({ contest, select, isSelected, mode = 'cards' }) => {
  const className =
    'fade-rise entries' + (contest.single ? ' single-fields' : '')

  if (contest.single) {
    let imageOnly = contest.fields[0].imageOnly
    return (
      <div className={className + (imageOnly ? ' image-only-fields' : '')}>
        {contest.entries.map(nominee => {
          return (
            <OtherCard
              onClick={() => select(nominee.data.key, nominee.data.identifier)}
              selected={isSelected(nominee.data.key)}
              imageOnly={imageOnly}
              data={nominee.data}
              single={true}
              key={nominee.data.key}
            />
          )
        })}
      </div>
    )
  }

  return (
    <div className={className}>
      <Masonry
        className='masonry-grid'
        columnClassName='masonry-column'
        breakpointCols={{
          default: 4,
          1199: 3,
          991: 2,
          576: 1
        }}
      >
        {contest.entries.map(nominee => {
          const selected = isSelected(nominee.data.key)
          const onClick = event => {
            let tag = event.target.tagName
            if (!['IMG', 'A', 'svg'].includes(tag)) {
              event.preventDefault()
              select(nominee.data.key, nominee.data.identifier)
            }
          }
          return contest.type === 'other' ? (
            <OtherCard
              key={nominee.data.key}
              onClick={onClick}
              selected={selected}
              data={nominee.data}
            />
          ) : contest.type === 'art' ? (
            <ArtCard
              key={nominee.data.key}
              onClick={onClick}
              selected={selected}
              formData={nominee.data}
            />
          ) : (
            <FicCard
              key={nominee.data.key}
              onClick={onClick}
              selected={selected}
              fic={nominee.data}
            />
          )
        })}
      </Masonry>
    </div>
  )
}

export default ContestEntries
