import React from 'react'

const getMapOfHeaders = (type, data, allNominees = null, skipBadges = false) => {
  
  if (type === "nominees" && allNominees) return data.nominees.map(nomineeId => {
    const { data: nomineeData, duplicates, statuses } = allNominees[nomineeId]
    const { name, title, author, artist, owner } = nomineeData

    let returnObject = {
      id: nomineeId,
      header: name || title || "Unknown",
      subheader: ((name && title) ? title
        : (author || artist || owner)) || "Unknown"
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

      let vetted = 0
      let duplicates = 0
      cat.nominees.forEach(nomineeId => {
        let nominee = allNominees[nomineeId]
        if (!nominee) return

        let status = nominee?.statuses[cat.id]
        if (!Number.isInteger(status)) return
        if (status < 0 || status === 1) vetted++

        let duplicatesCount = nominee?.duplicates?.length
        if (duplicatesCount) duplicates += duplicatesCount
      })
      let vettedClassName = `status-${vetted === cat.nominees.length ? 'approved' : 'rejected'} vetted-count`

      let returnObject = {
        id: cat.id,
        header: cat.name,
        subheader: <>
          <code className={vettedClassName}>{vetted}</code>{' '}
          <span className="slash-divider">/</span>{' '}
          <code>{cat.nominees.length}</code> vetted{' '}
          <span className="slash-divider">|</span>{' '}
          <code>{duplicates}</code> dupe{duplicates === 1 ? '' : 's'}
        </>
      }

      if (cat.collection && !skipBadges) returnObject.badges = {
        collection: cat.collection
      }

      returnData.push(returnObject)
    })
    return returnData
  }

  return []
}

export default getMapOfHeaders