import React from 'react'

const getMapOfHeaders = (type, data, allNominees = null, skipBadges = false) => {
  
  if (type === "nominees" && allNominees) return data.nominees.map(nomineeId => {
    let { data: nominee, duplicates, statuses } = allNominees[nomineeId]
    let returnObject = {
      id: nomineeId,
      header: nominee.name || nominee.title || "Unknown",
      subheader: (nominee.name && nominee.title) ? nominee.title
        : (nominee.author || nominee.artist || nominee.owner)
    }
    if (skipBadges) returnObject.badges = {
      duplicates: duplicates.length,
      currentStatus: statuses[data.id]
    }
    return returnObject
  })

  if (type === "categories") {
    let returnData = []
    let sections = {}
    data.forEach(cat => {
      if (!sections[cat.section]) {
        sections[cat.section] = true
        returnData.push({
          IS_HEADER: true,
          header: cat.section
        })
      }
      returnData.push({
        id: cat.id,
        header: cat.name,
        subheader: cat.collection ?
          <>
            {cat.nominees.length} nominees{' '}
            <span className="slash-divider">|</span>{' '}
            {cat.collection.toLowerCase()} collection
          </> : `${cat.nominees.length} nominees`
        // TODO: how to calculate the number of duplicates per category?
      })
    })
    return returnData
  }

  return []
}

export default getMapOfHeaders