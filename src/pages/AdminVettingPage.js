import React, { useState, useEffect } from 'react'
import { Redirect } from '@reach/router'
import '../style/admin.css'

import LoadingIndicator from '../components/util/LoadingIndicator'
import VetNomineeInterface from '../components/admin/VetNomineeInterface'
import ItemList from '../components/admin/ItemList'

const AdminVettingPage = ({ userData }) => {
  const [vettingData, setVettingData] = useState(null)
  const [categoriesList, setCategoriesList] = useState(null)
  const [categoryNomineesList, setCategoryNomineesList] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedNominee, setSelectedNominee] = useState(null)
  
  useEffect(() => {
    if (!userData.canVet || userData.LOADED_FROM_CACHE) return
    
    const prepareData = (resData, fetched = true) => {
      setVettingData(resData)
      let categories = Object.values(resData.categories)
      setCategoriesList(categories.map(cat => {
        return {
          id: cat.id,
          header: cat.name,
          subheader: <>{cat.nominees.length} nominees <span className="slash-divider">|</span> x duplicates</>
          // TODO: how to calculate the number of duplicates per category?
        }
      }))
      if (fetched) localStorage.vettables = JSON.stringify(resData)
    }
    
    let didParseCache = false
    let cached = localStorage.vettables
    if (cached)
    try {
      let parsed = JSON.parse(cached)
      prepareData(parsed, false)
      didParseCache = true
    } catch (e) {}
    
    if (didParseCache) return // just to make it faster to develop for

    const controller = new AbortController()
    window
      .fetch(`https://cauldron.angu.sh/api/vettables`, {
        credentials: 'include',
        signal: controller.signal
      })
      .then(response => response.json())
      .then(prepareData)
      .catch(console.error)

    return () => {
      controller.abort()
    }
  }, [userData])


  useEffect(() => {
    if (!selectedCategory) return
    let calculatedList = selectedCategory.nominees.map(nomineeId => {
      let { data: nominee, duplicates } = vettingData.nominees[nomineeId]
      return {
        id: nomineeId,
        header: nominee.name || nominee.title || "Unknown",
        subheader: nominee.name && nominee.title ? nominee.title
          : nominee.author || nominee.artist || nominee.owner,
        badge: duplicates.length
      }
    })
    setCategoryNomineesList(calculatedList)
  }, [selectedCategory, vettingData])


  if (!userData.canVet && !userData.LOADED_FROM_CACHE) return (
    <Redirect from='/admin/vetting' to='/unauthorized' noThrow />
  )

  if (!vettingData) return (
    <LoadingIndicator className='fade-rise' timeout={1000}>
      <h4>Just a moment!</h4>
      <h6 className='text-muted'>We're loading the vetting data.</h6>
    </LoadingIndicator>
  )

  const selectCategory = id => {
    // if (selectedCategory && id === selectedCategory.id) return
    if (id) setSelectedCategory(vettingData.categories[id])
    else {
      setSelectedCategory(null)
      setCategoryNomineesList(null)
    }
    setSelectedNominee(null)
  }
  const selectNominee = id => {
    if (id) setSelectedNominee(vettingData.nominees[id])
    else setSelectedNominee(null)
  }

  
  return (
    <div className='admin-vetting-page'>
      {categoriesList &&
        <ItemList items={categoriesList} select={selectCategory} selectedItem={selectedCategory} />
      }
      {selectedCategory && <div className='list-blocker'></div>}
      {selectedCategory &&
        <button className='hidden-button' onClick={() => selectCategory()}>
          {'< Select a different category'}
        </button>
      }
      {categoryNomineesList &&
        <ItemList items={categoryNomineesList} select={selectNominee} selectedItem={selectedNominee} depth={2} />
      }
      <VetNomineeInterface nominee={selectedNominee} />
    </div>
  )
}

export default AdminVettingPage