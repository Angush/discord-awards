import React, { useState, useEffect } from 'react'
import { Redirect } from '@reach/router'
import '../style/admin.css'

import LoadingIndicator from '../components/util/LoadingIndicator'
import VetNomineeInterface from '../components/admin/VetNomineeInterface'
import ItemList from '../components/admin/ItemList'

import getMapOfHeaders from '../functions/getMapOfHeaders'

const AdminVettingPage = ({ userData }) => {
  const [vettingData, setVettingData] = useState(null)
  const [categoriesList, setCategoriesList] = useState(null)
  const [categoryNomineesList, setCategoryNomineesList] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedNominee, setSelectedNominee] = useState(null)  

  
  //* Fetching and preparing vettables data
  useEffect(() => {
    if (!userData.canVet || userData.LOADED_FROM_CACHE) return
    
    const prepareData = (resData, fetched = true) => {
      setVettingData(resData)
      let categories = Object.values(resData.categories)
      setCategoriesList(getMapOfHeaders("categories", categories))
      if (fetched) localStorage.vettables = JSON.stringify(resData)
    }
    
    let cached = localStorage.vettables
    if (cached)
    try {
      let parsed = JSON.parse(cached)
      prepareData(parsed, false)
    } catch (e) {}
    
    const controller = new AbortController()
    window
      .fetch(`https://cauldron.angu.sh/api/vettables`, {
        credentials: 'include',
        signal: controller.signal
      })
      .then(response => response.json())
      .then(prepareData)
      .catch(console.error)

    return () => controller.abort()
  }, [userData])


  //* Prepare list of nominees upon category selection
  useEffect(() => {
    if (!selectedCategory || !vettingData.nominees) return
    let calculatedList = getMapOfHeaders("nominees", selectedCategory, vettingData.nominees)
    setCategoryNomineesList(calculatedList)
  }, [selectedCategory, vettingData])


  // TODO: Make edits to nominees (ie. changes to status and data) reflect in...
  // TODO:  (a) vettingData, (b) selectedNominee, (c) categoryNomineesList, (d) categoriesList
  // TODO: Obviously, also need to add edit functionality first.


  if (!userData.canVet && !userData.LOADED_FROM_CACHE) return (
    <Redirect from='/admin/vetting' to='/unauthorized' noThrow />
  )

  if (!vettingData) return (
    <div className='admin-vetting-page fade-rise'>
      <ItemList items={[]} />
      <div className='nominee-vet-ui no-nominee-selected'>
        <LoadingIndicator>
          <h4>Just a moment!</h4>
          <h6 className='text-muted'>We're loading the vetting data.</h6>
        </LoadingIndicator>
      </div>
    </div>
  )

  const getNomineeData = id => {
    let listItemData = categoryNomineesList.find(item => item.id === id) || {}
    return { ...listItemData, ...vettingData.nominees[id] }
  }

  const selectCategory = id => {
    if (id) setSelectedCategory(vettingData.categories[id])
    else {
      setSelectedCategory(null)
      setCategoryNomineesList(null)
    }
    setSelectedNominee(null)
  }

  const selectNominee = id => {
    if (id) setSelectedNominee(getNomineeData(id))
    else setSelectedNominee(null)
  }

  
  return (
    <div className='admin-vetting-page fade-rise'>
      {categoriesList &&
        <ItemList items={categoriesList} select={selectCategory} selectedItem={selectedCategory} />
      }
      {selectedCategory &&
        <button className='hidden-button' onClick={() => selectCategory()}>
          {'< Select a different category'}
        </button>
      }
      {selectedCategory &&
        <ItemList items={categoryNomineesList || []} select={selectNominee} selectedItem={selectedNominee} depth={2} />
      }
      <VetNomineeInterface
        nominee={selectedNominee}
        category={selectedCategory}
        getNomineeData={getNomineeData}
        data={vettingData}
      />
    </div>
  )
}

export default AdminVettingPage