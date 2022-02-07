import React, { useState, useEffect } from 'react'
import '../style/admin.css'

import LoadingIndicator from '../components/util/LoadingIndicator'
import VetNomineeInterface from '../components/admin/VetNomineeInterface'
import ItemList from '../components/admin/ItemList'
import RefreshButton from '../components/admin/RefreshButton'

import getMapOfHeaders from '../functions/getMapOfHeaders'
import fetch from '../functions/fetch'
import toast from 'react-hot-toast'

const AdminVettingPage = ({ userData }) => {
  const [vettingData, setVettingData] = useState(null)
  const [categoriesList, setCategoriesList] = useState(null)
  const [categoryNomineesList, setCategoryNomineesList] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState({})
  const [selectedNominee, setSelectedNominee] = useState(null)
  const [checkedNominees, setCheckedNominees] = useState({})
  const [failedFetch, setFailedFetch] = useState(false)
  const [loading, setLoading] = useState(true)

  //* Fetching and preparing vettables data
  useEffect(() => {
    const prepareData = (resData, fetched = true) => {
      setVettingData(resData)
      if (fetched) setLoading(false)
      if (fetched) localStorage.vettables = JSON.stringify(resData)
    }

    const reportFailure = (errorData) => {
      console.error(errorData)
      setFailedFetch(true)
    }

    let cached = localStorage.vettables
    if (cached)
      try {
        let parsed = JSON.parse(cached)
        prepareData(parsed, false)
      } catch (e) {}

    const controller = new AbortController()

    const getData = () => {
      return fetch(`https://cauldron.angu.sh/api/vettables`, {
        credentials: 'include',
        signal: controller.signal,
      })
        .then(prepareData)
        .catch(reportFailure)
    }

    if (cached) {
      toast.promise(
        getData(),
        {
          loading: 'Refreshing cached data...',
          success: "You're all up-to-date!",
          error: 'Could not refresh!',
        },
        {
          duration: 5000,
          loading: {
            duration: Infinity,
          },
        }
      )
    } else {
      getData()
    }

    return () => controller.abort()
  }, [])

  //* Assemble list of categories when vettingData changes
  useEffect(() => {
    if (!vettingData || !vettingData.categories || !vettingData.nominees) return
    let categories = Object.values(vettingData.categories)
    setCategoriesList(
      getMapOfHeaders('categories', categories, vettingData.nominees)
    )

    //* Also make sure the derived state is all up-to-date with the new vettingData
    const id = selectedCategory.id
    if (!!id && Number.isInteger(id)) {
      setCategoryNomineesList(
        getMapOfHeaders(
          'nominees',
          vettingData.categories[id],
          vettingData.nominees
        )
      )
      setSelectedCategory(vettingData.categories[id])
    }
  }, [vettingData, selectedCategory.id])

  const refreshAll = () => {
    setLoading('refresh')
    toast.promise(
      fetch(`https://cauldron.angu.sh/api/vettables`, {
        credentials: 'include',
      })
        .then((resData) => {
          setLoading(false)
          setVettingData(resData)
          localStorage.vettables = JSON.stringify(resData)
        })
        .catch((errData) => {
          setLoading(false)
          setFailedFetch(true)
          console.error(errData)
        }),
      {
        loading: 'Refreshing vetting data...',
        success: "You're all up-to-date!",
        error: 'Could not refresh!',
      },
      {
        duration: 5000,
        loading: {
          duration: Infinity,
        },
      }
    )
  }

  //* Early return on invalid data
  if (failedFetch)
    return (
      <div className='admin-vetting-page fade-rise'>
        <ItemList items={[]} />
        <div className='nominee-vet-ui no-nominee-selected loading-section'>
          <div>
            <h4>Uh-oh!</h4>
            <h6 className='text-muted text-error'>
              Something went wrong, and we couldn't load the vetting data!
              <br /> <br />
              Try again later, or if this persists, contact the admin.
            </h6>
          </div>
        </div>
      </div>
    )

  //* And early return if we're loading for the first time
  if (!vettingData || !categoriesList)
    return (
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

  const getNomineeData = (id) => {
    let listItemData = categoryNomineesList.find((item) => item.id === id) || {}
    return { ...listItemData, ...vettingData.nominees[id] }
  }

  const selectCategory = (id) => {
    if (id) {
      let calculatedList = getMapOfHeaders(
        'nominees',
        vettingData.categories[id],
        vettingData.nominees
      )
      setSelectedCategory(vettingData.categories[id])
      setCategoryNomineesList(calculatedList)
    } else {
      setSelectedCategory({})
      setCategoryNomineesList(null)
    }
    setSelectedNominee(null)
    setCheckedNominees({})
  }

  const selectNominee = (id) => {
    if (id) setSelectedNominee(getNomineeData(id))
    else setSelectedNominee(null)
  }

  const selectDuplicateNominee = (id) => {
    if (id)
      setSelectedNominee({
        ...vettingData.nominees[id],
        parent: selectedNominee,
      })
    else if (selectedNominee.parent)
      setSelectedNominee({
        ...selectedNominee.parent,
        ...vettingData.nominees[selectedNominee.parent.id],
      })
    else
      console.error(
        `Can't change selection! ID provided: "${id}" - Current selection:`,
        selectedNominee
      )
  }

  const assembleListOfIDs = (change, index, ids) => {
    if (index === ids.length - 1) return <code>{change.id}</code>
    return (
      <>
        <code>{change.id}</code>,{' '}
      </>
    )
  }

  const generateName = (data) => {
    let creator = data.artist || data.owner || null
    if (data.name && selectedCategory.type !== 'art') {
      if (data.title) return `${data.name} in ${data.title}`
      if (creator || data.author)
        return `${creator || data.author}'s ${data.name}`
      return data.name
    }

    if (data.title) {
      if (creator) return `${creator}'s ${data.title}`
      return data.title
    }

    if (data.link) return data.link
    if (data.image) return data.image
  }

  const getChangeText = (changes) => {
    let count = changes.length
    if (count === 1) {
      let change = vettingData.nominees[changes[0].id]
      let itemName = generateName(change.data)
      if (changes[0].data) {
        return (
          <>
            data for {itemName} (<code>{change.id}</code>)
          </>
        )
      } else if (changes[0].statuses) {
        return (
          <>
            status for {itemName} (<code>{change.id}</code>)
          </>
        )
      } else {
        return (
          <>
            {itemName} (<code>{change.id}</code>)
          </>
        )
      }
    } else {
      if (changes[0].data) {
        let itemName = generateName(selectedNominee.data)
        let ids = changes
          .filter((change) => change.id !== selectedNominee.id)
          .map(assembleListOfIDs)
        return (
          <>
            data for {itemName} (<code>{selectedNominee.id}</code>) and{' '}
            {count - 1} duplicates ({ids})
          </>
        )
      } else if (changes[0].statuses) {
        let ids = changes.map(assembleListOfIDs)
        return (
          <>
            status for {count} nominees ({ids})
          </>
        )
      } else {
        let ids = changes.map(assembleListOfIDs)
        return (
          <>
            {count} nominees ({ids})
          </>
        )
      }
    }
  }

  //* update vettingData on status/data changes and handle POSTing to API
  const sendUpdatedNomineeData = (nomineesArray) => {
    const Infinite = { duration: Infinity }
    toast.promise(
      fetch(`https://cauldron.angu.sh/api/edit-nominee`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(nomineesArray),
      }),
      {
        loading: <div>Submitting changes...</div>,
        success: <div>Updated {getChangeText(nomineesArray)}!</div>,
        error: () => (t) =>
          (
            <>
              <div>
                Failed to update {getChangeText(nomineesArray)}! You may need to
                refresh the page or log in again.
              </div>
              <div className='dismiss-toast-container'>
                <div
                  className='dismiss-toast'
                  onClick={() => toast.dismiss(t.id)}
                />
              </div>
            </>
          ),
      },
      {
        duration: nomineesArray.length > 1 && 4000,
        loading: Infinite,
        error: Infinite,
      }
    )
  }

  const updateNomineeData = (nomineesArray, type = 'status', callback) => {
    let newVettingData = { ...vettingData }
    let newSelectedNominee = null
    let correctedNominees = []

    nomineesArray.forEach((nomineeData) => {
      let statusChanges = nomineeData.statusChanges

      if (type === 'status' && statusChanges) {
        correctedNominees.push({
          id: nomineeData.id,
          statuses: statusChanges,
        })
      } else if (type === 'data') {
        correctedNominees.push({
          id: nomineeData.id,
          data: nomineeData.data,
        })
      }

      delete nomineeData.badges
      delete nomineeData.header
      delete nomineeData.subheader
      delete nomineeData.statusChanges

      newVettingData.nominees[nomineeData.id] = nomineeData
      if (selectedNominee && selectedNominee.id === nomineeData.id) {
        let headers = getMapOfHeaders(
          'nominees',
          { nominees: [nomineeData.id] },
          { [nomineeData.id]: nomineeData }
        )[0]
        newSelectedNominee = { ...headers, ...nomineeData }
      }
    })

    setVettingData(newVettingData)
    try {
      localStorage.vettables = JSON.stringify(newVettingData)
    } catch (e) {}
    if (newSelectedNominee) setSelectedNominee(newSelectedNominee)
    if (correctedNominees.length > 0) sendUpdatedNomineeData(correctedNominees)
    if (callback) callback()
  }

  const updateStatus = ({ id, catId }, status, POST = true) => {
    const getStatusValue = (change) => {
      if (change === 'approve') return 1
      if (change === 'reject') return -1
      if (change === 'reset') return 0
    }

    let nomineeToUpdate = vettingData.nominees[id]
    if (!Number.isInteger(nomineeToUpdate.statuses[catId])) return

    let newStatusValue = getStatusValue(status)
    nomineeToUpdate.statuses[catId] = newStatusValue
    nomineeToUpdate.statusChanges = [
      { category: catId, status: newStatusValue },
    ]

    if (POST) updateNomineeData([nomineeToUpdate])
    else return nomineeToUpdate
  }

  const updateCheckedNominees = (status) => {
    if (!selectedCategory.id) return
    let nomineesToUpdate = []
    Object.keys(checkedNominees).forEach((key) => {
      let nom = updateStatus(
        { id: parseInt(key), catId: selectedCategory.id },
        status,
        false
      )
      nomineesToUpdate.push(nom)
    })
    if (nomineesToUpdate.length > 0)
      updateNomineeData(nomineesToUpdate, 'status', () =>
        setCheckedNominees({})
      )
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
    if (!hasSelectedCategory || !vettingData?.nominees)
      return (
        <div className='nominee-vet-ui no-nominee-selected'>
          <div>
            <h1>Select a category to start vetting!</h1>
            {loading !== true && (
              <RefreshButton disabled={loading} refresh={refreshAll}>
                Refresh Everything
              </RefreshButton>
            )}
          </div>
        </div>
      )

    if (!selectedNominee?.data) {
      return (
        <div className='nominee-vet-ui no-nominee-selected'>
          <div>
            <h1>
              You've selected{' '}
              <span className='text-muted bold'>{selectedCategory.name}</span>.
            </h1>
            <h2>Now select a nominee to vet it!</h2>
            {loading !== true && (
              <RefreshButton disabled={loading} refresh={refreshAll}>
                Refresh Category
              </RefreshButton>
            )}
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
        select={selectDuplicateNominee}
        data={vettingData}
      />
    )
  }

  return (
    <div className='admin-vetting-page fade-rise'>
      {categoriesList && (
        <ItemList
          key='categories'
          name='categories'
          items={categoriesList}
          select={selectCategory}
          selectedItem={selectedCategory}
        />
      )}
      {hasSelectedCategory && (
        <button className='hidden-button' onClick={() => selectCategory()}>
          {'< Select a different category'}
        </button>
      )}
      {hasSelectedCategory && (
        <ItemList
          key='cat-nominees'
          name='nominees'
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
      )}
      {renderVetNomineeInterface()}
    </div>
  )
}

export default AdminVettingPage
