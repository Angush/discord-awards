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

  if (type === "categories") return data.map(cat => {
    return {
      id: cat.id,
      header: cat.name,
      subheader: <>{cat.nominees.length} nominees <span className="slash-divider">|</span> x duplicates</>
      // TODO: how to calculate the number of duplicates per category?
    }
  })

  return []
}

export default getMapOfHeaders