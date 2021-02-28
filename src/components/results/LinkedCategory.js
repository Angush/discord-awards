import React, { useState, useEffect } from 'react'
import makeSafeForURL from '../../functions/makeSafeForURL'
import jumpToID from '../../functions/jumpToID'
import MapOfSections from './MapOfSections'

const LinkedCategory = ({ slug, data, year, userVotes, userCategoryVotes, navigate }) => {
  const [jumpTarget, setJumpTarget] = useState(
    slug ? slug.toLowerCase().replace(/^[^\w-]*/, '') : null
  )
  const [target, setTarget] = useState(null)

  useEffect(() => {
    if (!jumpTarget || !data) return
    let targetCategory = null
    let targetSection = data.sections.find(section => {
      let category = section.categories.find(category => makeSafeForURL(category.title) === jumpTarget)
      if (category) {
        targetCategory = category
        return true
      }
      return false
    })
    if (targetCategory && targetSection) setTarget({ ...targetSection, linkedCategory: targetCategory })
    else setJumpTarget(null)
  }, [jumpTarget, data])

  useEffect(() => {
    let navElement = document.querySelector(`.vote-nav .container`)
    if (navElement) {
      navElement.classList.add(`remove-vote-nav-indent`)
      return () => navElement.classList.remove(`remove-vote-nav-indent`)
    }
  }, [])

  const clearTarget = () => {
    setTarget(null)
    setJumpTarget(null)
    navigate('../')

    setTimeout(() => {
      let element = document.querySelector(`#${jumpTarget}`)
      if (!element) return
      jumpToID(jumpTarget, {
        offset: 100,
        smooth: false
      })
    }, 100)
  }

  return (
    <MapOfSections
      data={data}
      year={year}
      userVotes={userVotes}
      userCategoryVotes={userCategoryVotes}
      clearTarget={clearTarget}
      target={target}
    />
  )
}

export default LinkedCategory