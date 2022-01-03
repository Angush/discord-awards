import React, { useState, useEffect } from 'react'
import makeSafeForURL from '../../functions/makeSafeForURL'
import MapOfSections from './MapOfSections'
import getLoginPathName from '../../functions/getLoginPathName'

const LinkedCategory = ({
  slug,
  data,
  year,
  userData,
  userVotes,
  userCategoryVotes,
  navigate,
}) => {
  const [jumpTarget, setJumpTarget] = useState(
    slug ? slug.toLowerCase().replace(/^[^\w-]*/, '') : null
  )
  const [target, setTarget] = useState(null)

  useEffect(() => {
    if (!jumpTarget || !data) return
    let targetCategory = null
    let targetSection = data.sections.find((section) => {
      let category = section.categories.find(
        (category) => makeSafeForURL(category.title) === jumpTarget
      )
      if (category) {
        targetCategory = category
        return true
      }
      return false
    })
    if (targetCategory && targetSection)
      setTarget({ ...targetSection, linkedCategory: targetCategory })
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
    navigate('../', { state: { jumpedTo: jumpTarget } })
  }

  return (
    <>
      {!userData.logged_in && (
        <div style={{ display: 'flex' }}>
          <a style={{ margin: '2rem auto 0 auto' }} href={getLoginPathName()}>
            Login here to view what you voted for.
          </a>
        </div>
      )}
      <MapOfSections
        data={data}
        year={year}
        userVotes={userVotes}
        userCategoryVotes={userCategoryVotes}
        clearTarget={clearTarget}
        target={target}
      />
    </>
  )
}

export default LinkedCategory
