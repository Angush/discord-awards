import React from 'react'
import Masonry from 'react-masonry-css'
import OtherCard from '../cards/OtherCard'
import FicCard from '../cards/FicCard'
import ArtCard from '../cards/ArtCard'

const ContestEntries = ({ contest, select, isSelected, mode = 'cards' }) => {
  const className =
    'fade-rise entries' + (contest.single ? ' single-fields' : '')
  const str = `c${contest.id}_e`

  if (contest.single) {
    let imageOnly = contest.fields[0].imageOnly
    return (
      <div className={className + (imageOnly ? ' image-only-fields' : '')}>
        {contest.entries.map(nominee => {
          const id = `${str}${nominee.id}`
          return (
            <OtherCard
              onClick={() => select(id, nominee.identifier)}
              selected={isSelected(id)}
              imageOnly={imageOnly}
              data={nominee.data}
              single={true}
              key={id}
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
          575: 1
        }}
      >
        {contest.entries.map(nominee => {
          const id = `${str}${nominee.id}`
          const selected = isSelected(id)
          const onClick = event => {
            let tag = event.target.tagName
            if (!['IMG', 'A'].includes(tag)) {
              event.preventDefault()
              select(id, nominee.identifier)
            }
          }
          return contest.type === 'other' ? (
            <OtherCard
              key={id}
              onClick={onClick}
              selected={selected}
              data={nominee.data}
            />
          ) : contest.type === 'art' ? (
            <ArtCard
              key={id}
              onClick={onClick}
              selected={selected}
              formData={nominee.data}
            />
          ) : (
            <FicCard
              key={id}
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
