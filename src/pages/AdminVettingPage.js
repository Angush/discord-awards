import React, { useState, useEffect } from 'react'
import '../style/admin.css'

import LoadingIndicator from '../components/util/LoadingIndicator'
import VetNomineeInterface from '../components/admin/VetNomineeInterface'
import ItemList from '../components/admin/ItemList'

import getMapOfHeaders from '../functions/getMapOfHeaders'

const AdminVettingPage = ({ userData }) => {
  const [vettingData, setVettingData] = useState(null)
  const [categoriesList, setCategoriesList] = useState(null)
  const [categoryNomineesList, setCategoryNomineesList] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState({})
  const [selectedNominee, setSelectedNominee] = useState(null)
  const [checkedNominees, setCheckedNominees] = useState({})
  
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
    if (!vettingData || !vettingData.categories || !vettingData.nominees) return
    let categories = Object.values(vettingData.categories)
    setCategoriesList(getMapOfHeaders("categories", categories, vettingData.nominees))
    
    //* Also make sure the derived state is all up-to-date with the new vettingData
    const id = selectedCategory.id
    if (!!id && Number.isInteger(id)) {
      setCategoryNomineesList(getMapOfHeaders("nominees", vettingData.categories[id], vettingData.nominees))
      setSelectedCategory(vettingData.categories[id])
    }
  }, [vettingData, selectedCategory.id])
  
  //* Early return on invalid data
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
    if (id) {
      let calculatedList = getMapOfHeaders("nominees", vettingData.categories[id], vettingData.nominees)
      setSelectedCategory(vettingData.categories[id])
      setCategoryNomineesList(calculatedList)
    } else {
      setSelectedCategory({})
      setCategoryNomineesList(null)
    }
    setSelectedNominee(null)
    setCheckedNominees({})
  }

  const selectNominee = id => {
    if (id) setSelectedNominee(getNomineeData(id))
    else setSelectedNominee(null)
  }

  //* update vettingData on status/data changes and handle POSTing to API
  const sendUpdatedNomineeData = nomineesArray => {
    window.fetch(`https://cauldron.angu.sh/api/edit-nominee`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify(nomineesArray)
    })

    console.log(`POST'd data to /api/edit-nominee!\n${nomineesArray.length} nominee${nomineesArray.length === 1 ? '' : 's'} are being edited:`, nomineesArray)
  }
  
  const updateNomineeData = (nomineesArray, type = 'status', callback) => {
    let newVettingData = { ...vettingData }
    let newSelectedNominee = null
    let correctedNominees = []

    nomineesArray.forEach(nomineeData => {
      let statusChanges = nomineeData.statusChanges

      if (type === 'status' && statusChanges) {
        correctedNominees.push({
          id: nomineeData.id,
          statuses: statusChanges
        })
      } else if (type === 'data') {
        correctedNominees.push({
          id: nomineeData.id,
          data: nomineeData.data
        })
      }

      delete nomineeData.badges
      delete nomineeData.header
      delete nomineeData.subheader
      delete nomineeData.statusChanges

      newVettingData.nominees[nomineeData.id] = nomineeData
      if (selectedNominee && selectedNominee.id === nomineeData.id) {
        let headers = getMapOfHeaders(
          "nominees",
          { nominees: [nomineeData.id] },
          { [nomineeData.id]: nomineeData }
        )[0]
        newSelectedNominee = { ...headers, ...nomineeData }
      }
    })

    setVettingData(newVettingData)
    try { localStorage.vettables = JSON.stringify(newVettingData) } catch (e) {}
    if (newSelectedNominee) setSelectedNominee(newSelectedNominee)
    if (correctedNominees.length > 0) sendUpdatedNomineeData(correctedNominees)
    if (callback) callback()
  }

  const updateStatus = ({ id, catId }, status, POST = true) => {
    const getStatusValue = change => {
      if (change === "approve") return 1
      if (change === "reject") return -1
      if (change === "reset") return 0
    }

    let nomineeToUpdate = vettingData.nominees[id]
    if (!Number.isInteger(nomineeToUpdate.statuses[catId])) return

    let newStatusValue = getStatusValue(status)
    nomineeToUpdate.statuses[catId] = newStatusValue
    nomineeToUpdate.statusChanges = [{ category: catId, status: newStatusValue }]

    if (POST) updateNomineeData([nomineeToUpdate])
    else return nomineeToUpdate
  }

  const updateCheckedNominees = status => {
    if (!selectedCategory.id) return
    let nomineesToUpdate = []
    Object.keys(checkedNominees).forEach(key => {
      let nom = updateStatus({ id: parseInt(key), catId: selectedCategory.id }, status, false)
      nomineesToUpdate.push(nom)
    })
    if (nomineesToUpdate.length > 0) updateNomineeData(nomineesToUpdate, 'status', () => setCheckedNominees({}))
  }

  const checkNominee = (nomId, reset = false) => {
    console.log(`checkNominee called`, { nomId, reset })
    if (reset) {
      return setCheckedNominees({})
    }
    let checked = { ...checkedNominees }
    if (checked[nomId]) delete checked[nomId]
    else checked[nomId] = true
    setCheckedNominees(checked)
  }

  const hasSelectedCategory = Object.values(selectedCategory).length > 0

  //* render the interface if we have an interface to render, else render instructions
  const renderVetNomineeInterface = () => {
    if (!hasSelectedCategory || !vettingData?.nominees) return (
      <div className='nominee-vet-ui no-nominee-selected'>
        <h1>Select a category & nominee to vet it!</h1>
      </div>
    )

    if (!selectedNominee?.data) {
      return (
        <div className='nominee-vet-ui no-nominee-selected'>
          <div>
            <h1>You've selected <span className='text-muted bold'>{selectedCategory.name}</span>.</h1>
            <h2>Now select a nominee to vet it!</h2>
          </div>
        </div>
      )
    }

    return (
      <VetNomineeInterface
        nominee={selectedNominee}
        category={selectedCategory}
        getNomineeData={getNomineeData}
        updateNomineeData={updateNomineeData}
        data={vettingData}
      />
    )
  }
  
  return (
    <div className='admin-vetting-page fade-rise'>
      {categoriesList &&
        <ItemList
          key="categories"
          name="categories"
          items={categoriesList}
          select={selectCategory}
          selectedItem={selectedCategory}
        />
      }
      {hasSelectedCategory &&
        <button className='hidden-button' onClick={() => selectCategory()}>
          {'< Select a different category'}
        </button>
      }
      {hasSelectedCategory &&
        <ItemList
          key="cat-nominees"
          name="nominees"
          items={categoryNomineesList || []}
          select={selectNominee}
          selectedItem={selectedNominee}
          parentId={selectedCategory.id}
          updateStatus={updateStatus}
          setStatuses={updateCheckedNominees}
          checked={checkedNominees}
          check={checkNominee}
          depth={2}
        />
      }
      {renderVetNomineeInterface()}
    </div>
  )
}

export default AdminVettingPage