import React, { useState, useEffect, useCallback } from 'react'
import envVarIsTrue from '../functions/envVarIsTrue'
import NominationFlow from '../flows/NominationFlow'
import { Link } from '@reach/router'
import PageHelmet from '../components/util/PageHelmet'

const NominationPage = ({ userData }) => {
  const [nominationsClosed, setNominationsClosed] = useState(
    envVarIsTrue(`NOMINATIONS_CLOSED`) && !userData.canNominate
  )
  const [categories, setCategories] = useState([])
  const [collections, setCollections] = useState({})
  const [categoryTypes, setCategoryTypes] = useState([])
  const currentYear =
    new Date().getMonth() >= 10
      ? new Date().getFullYear()
      : new Date().getFullYear() - 1

  const populateCategories = useCallback(data => {
    //* set category types
    let types = data.reduce((arr, { type, section }) => {
      let obj = { type, section }
      if (arr.some(existing => existing.type === type)) return arr
      else return [...arr, obj]
    }, [])
    setCategoryTypes(types)

    //* set categories & category collections
    //! note: this collections variable is not used, as it's intended for the split display mode, which has yet to be implemented
    let collections = {}
    types.forEach(({ type, section }) => {
      collections[section] = {}
    })

    data.forEach(category => {
      if (!category.collection) return
      collections[category.section][category.collection] = true
    })

    for (const section in collections) {
      collections[section] = Object.keys(collections[section])
    }

    setCollections(collections)
    setCategories(data)
  }, [])

  useEffect(() => {
    if (nominationsClosed || !populateCategories) return
    let cached = localStorage.categories
    if (cached) populateCategories(JSON.parse(cached))
    window
      .fetch(`https://cauldron.angu.sh/api/contests`, {
        credentials: 'include',
      })
      .then(response => response.json())
      .then(rawData => {
        let data = Object.values(rawData)
        let stringified = JSON.stringify(data)
        if (cached !== stringified) {
          populateCategories(data)
          localStorage.categories = stringified
          localStorage.nominees = []
        }
      })
  }, [populateCategories, nominationsClosed])

  useEffect(() => {
    if (userData.canNominate) setNominationsClosed(false)
  }, [userData.canNominate])

  //* Render the components, or the message about nominations being closed
  if (nominationsClosed) {
    return (
      <div className='fade-rise text-center pad-top closed-page-indicator'>
        <h3>Nominations are currently closed.</h3>
        <p>They will reopen in January for the next Cauldron Awards.</p>
        <p>
          Visit <Link to='/results'>the results page</Link> to see the results
          of past years!
        </p>

        <PageHelmet
          meta={{
            description: `Cauldron Awards nominations are currently closed. Come back in January!`,
            title: `Nominations - Cauldron Awards ${currentYear}`,
            image: `/images/metadata/nominations.png`,
          }}
        />
      </div>
    )
  }

  return (
    <>
      <PageHelmet
        meta={{
          description: `Cauldron Awards nominations are open! Nominate your favourite fanfics and fanart and community members for one of our ${categories.length} categories!`,
          title: `Nominations - Cauldron Awards ${currentYear}`,
          image: `/images/metadata/nominations.png`,
        }}
      />
      <NominationFlow
        categories={categories}
        collections={collections}
        categoryTypes={categoryTypes}
      />
    </>
  )
}

export default NominationPage
