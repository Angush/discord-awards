import React, { useState, useEffect, useCallback } from 'react'
import envVarIsTrue from '../functions/envVarIsTrue'
import NominationFlow from '../flows/NominationFlow'
import { Link } from '@reach/router'

const NominationPage = ({ userData }) => {
  const [categories, setCategories] = useState([])
  const [collections, setCollections] = useState({})
  const [categoryTypes, setCategoryTypes] = useState([])

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
    if (envVarIsTrue(`NOMINATIONS_CLOSED`)) return
    let cached = localStorage.categories
    if (cached) populateCategories(JSON.parse(cached))
    window
      .fetch(`https://cauldron.angu.sh/api/contests`, { credentials: 'include' })
      .then(response => response.json())
      .then(rawData => {
        let data = Object.values(rawData).map(c => {
          if (c.fields) return { ...c, fields: JSON.parse(c.fields) }
          else return c
        })
        let stringified = JSON.stringify(data)
        if (cached !== stringified) {
          populateCategories(data)
          localStorage.categories = stringified
          localStorage.nominees = []
        }
      })
  }, [populateCategories])

  //* Render the components, or the message about nominations being closed
  if (envVarIsTrue(`NOMINATIONS_CLOSED`) && !userData.canNominate)
    return (
      <div className='fade-rise text-center pad-top closed-page-indicator'>
        <h3>Nominations are currently closed.</h3>
        <p>They will reopen in January for the next Cauldron Awards.</p>
        <p>Visit <Link to='/results'>the results page</Link> to see the results of past years!</p>
      </div>
    )

  return (
    <NominationFlow
      categories={categories}
      collections={collections}
      categoryTypes={categoryTypes}
    />
  )

}

export default NominationPage