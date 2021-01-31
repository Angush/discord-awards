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
      if (fetched) localStorage.vettables = JSON.stringify(resData)
    }
    
    let cached = localStorage.vettables
    if (cached) try {
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


  //* Assemble list of categories when vettingData changes
  useEffect(() => {
    if (!vettingData || !vettingData.categories) return
    let categories = Object.values(vettingData.categories)
    setCategoriesList(getMapOfHeaders("categories", categories, vettingData.nominees))
  }, [vettingData])


  //* Prepare list of nominees upon category selection
  useEffect(() => {
    if (!selectedCategory || !vettingData.nominees) return
    let calculatedList = getMapOfHeaders("nominees", selectedCategory, vettingData.nominees)
    setCategoryNomineesList(calculatedList)
  }, [selectedCategory, vettingData])


  //* Early returns on invalid auth or data
  if (!userData.canVet && !userData.LOADED_FROM_CACHE) return (
    <Redirect from='/admin/vetting' to='/unauthorized' noThrow />
  )

  if (!vettingData || !categoriesList) return (
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

  const updateNomineeData = (nomineeId, newData) => {
    console.time(`update nominee ${nomineeId} data`)
    let newVettingData = { ...vettingData }
    newVettingData.nominees[nomineeId] = newData
    setVettingData(newVettingData)
    console.timeEnd(`update nominee ${nomineeId} data`)
  }

  const updateStatus = ({ id, catId }, status) => {
    const getStatusValue = change => {
      if (change === "approve") return 1
      if (change === "reject") return -1
      if (change === "reset") return 0
    }

    let newData = vettingData.nominees[id]
    if (!Number.isInteger(newData.statuses[catId])) return
    
    let newStatusValue = getStatusValue(status)
    newData.statuses[catId] = newStatusValue

    delete newData.header
    delete newData.subheader
    delete newData.badges
    
    updateNomineeData(id, newData)
  }

  
  return (
    <div className='admin-vetting-page fade-rise'>
      {categoriesList &&
        <ItemList
          key="categories"
          items={categoriesList}
          select={selectCategory}
          selectedItem={selectedCategory}
        />
      }
      {selectedCategory &&
        <button className='hidden-button' onClick={() => selectCategory()}>
          {'< Select a different category'}
        </button>
      }
      {selectedCategory &&
        <ItemList
          key="cat-nominees"
          items={categoryNomineesList || []}
          select={selectNominee}
          selectedItem={selectedNominee}
          parentId={selectedCategory.id}
          updateStatus={updateStatus}
          depth={2}
        />
      }
      <VetNomineeInterface
        nominee={selectedNominee}
        category={selectedCategory}
        getNomineeData={getNomineeData}
        updateNomineeData={updateNomineeData}
        data={vettingData}
      />
    </div>
  )
}

export default AdminVettingPage