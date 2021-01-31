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
    if (!skipBadges) returnObject.badges = {
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

      let duplicates = cat.nominees.reduce((dupeCount, nomineeId) => {
        let nomineeDuplicates = allNominees[nomineeId]?.duplicates.length
        if (!nomineeDuplicates) return dupeCount
        return dupeCount + nomineeDuplicates
      }, 0)

      let returnObject = {
        id: cat.id,
        header: cat.name,
        subheader: <>
          {cat.nominees.length} nominees{' '}
          <span className="slash-divider">|</span>{' '}
          {duplicates} duplicates
        </>
        // TODO: how to calculate the number of duplicates per category?
      }

      if (cat.collection) returnObject.badges = {
        collection: cat.collection
      }

      returnData.push(returnObject)
    })
    return returnData
  }

  return []
}

export default getMapOfHeaders