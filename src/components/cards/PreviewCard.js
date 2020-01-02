import React from 'react'
import OtherCard from './OtherCard'
import FicCard from './FicCard'
import ArtCard from './ArtCard'

const PreviewCard = props => {
  let propsCopy = { ...props }
  let { type } = propsCopy
  delete propsCopy.type

  if (propsCopy.hide) {
    propsCopy.className = propsCopy.className
      ? propsCopy.className + ' d-none'
      : 'd-none'
    delete propsCopy.hide
  }

  // return the easy ones
  if (type === 'fic') return <FicCard {...propsCopy} />
  if (type === 'art') return <ArtCard {...propsCopy} />

  // calculations for 'other' category card previews
  let { data, requiredTypes } = propsCopy
  delete propsCopy.requiredTypes

  let allNull = Object.values(data).every(item => (item ? false : true))
  if (allNull || Object.values(data).length === 0) return null

  const vowels = ['a', 'e', 'i', 'o', 'u']
  const blankField = field => {
    if (field === 'image') return '/images/noimage.png'
    if (field === 'link') return '#no-link'
    let value = requiredTypes[field].toLowerCase()
    return `Enter ${
      value.charAt(value.length - 1) === 's'
        ? 'some'
        : vowels.includes(value.charAt(0))
        ? 'an'
        : 'a'
    } ${value}.`
  }

  const cardData = {}
  for (const field in requiredTypes) {
    cardData[field] = data[field] || blankField(field)
  }
  propsCopy.data = cardData

  let fieldCount = Object.values(cardData).filter(field => field || false)
    .length
  if (
    (fieldCount === 1 && !cardData.image) ||
    (fieldCount === 2 && cardData.link && cardData.name)
  )
    propsCopy.single = true

  return <OtherCard {...propsCopy} />
}

export default PreviewCard
