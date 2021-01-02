import React, { useState, useEffect, useCallback } from 'react'
import LoadingIndicator from '../components/util/LoadingIndicator'
import CategoryTypeSelect from '../components/nominate/CategoryTypeSelect'
import SelectCategory from '../components/nominate/SelectCategory'
import SubmitStep from '../components/nominate/SubmitStep'
import InputMain from '../components/nominate/InputMain'
import JumpTo from '../components/util/JumpTo'
import GoBack from '../components/util/GoBack'
// import { Link } from '@reach/router'

const NominationPage = props => {
  // return (
  //   <div className='fade-rise text-center pad-top'>
  //     <h3>Nominations are currently closed.</h3>
  //     <p>
  //       They will reopen in January 2021 for the 2020 Cauldron Awards. Visit{' '}
  //       <Link to='/results'>the results page</Link> to see 2019's results!
  //     </p>
  //   </div>
  // )
  
  const [categoryTypes, setCategoryTypes] = useState([])
  const [collections, setCollections] = useState({})
  const [categories, setCategories] = useState([])
  const [nominee, setNominee] = useState({})
  const [selected, setSelected] = useState({
    type: null,
    section: null,
    categories: []
  })
  const [done, setDone] = useState({
    stepTwo: false,
    stepThree: false,
    submitting: false
  })

  // const [clicked, setClicked] = useState(false)
  // const href = props['*']

  const populateCategories = useCallback(data => {
    //* set category types
    let types = data.reduce((arr, { type, section }) => {
      let obj = { type, section }
      if (arr.some(existing => existing.type === type)) return arr
      else return [...arr, obj]
    }, [])
    setCategoryTypes(types)

    //* set categories

    // data.forEach(category => {
    //   if (!category.collection) category.collection = "NO_OLL"
    // })

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

    // data.forEach(category => {
    //   if (!category.collection) return categoriesData[category.section].general.push(category)
    //   if (!categoriesData[category.section][category.collection]) categoriesData[category.section][category.collection] = []
    //   categoriesData[category.section][category.collection].push(category)
    // })

    // setCategories(categoriesData)

    setCategories(data)
  }, [])

  useEffect(() => {
    let cached = localStorage.categories
    if (cached) populateCategories(JSON.parse(cached))
    window
      .fetch(`https://cauldron.angu.sh/api/contests`)
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

  const save = nomineeData => {
    setNominee(nomineeData)
  }

  const submit = nomineeData => {
    if (!nomineeData && (!nominee || Object.values(nominee).length === 0)) return
    setDone({
      ...done,
      submitting: true
    })

    let approval = 0 // 0 indicating unvetted manual input
    let editedData = nomineeData || nominee
    if (editedData.MANUAL_INPUT === false) {
      delete editedData.approval
      delete editedData.MANUAL_INPUT
      approval = 2 // 2 indicating it was not manual input
    }


    let dataToSubmit = {
      categories: selected.categories.map(c => c.id),
      data: editedData,
      approval: approval
    }

    window
      .fetch(`https://cauldron.angu.sh/api/nominate`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'text/plain'
        },
        body: JSON.stringify(dataToSubmit)
      })
      .then(res => {
        if (res.status === 201) {
          setDone({
            ...done,
            stepThree: true,
            submitting: false
          })

          //- Save updated nominees to localStorage
          let nominees = localStorage.nominees
            ? JSON.parse(localStorage.nominees)
            : []

          localStorage.nominees = JSON.stringify([
            ...nominees,
            { ...dataToSubmit }
          ])
        } else {
          setDone({
            ...done,
            stepThree: 'error',
            submitting: false
          })
        }
      })
      .catch(err => {
        console.error(`POST to /api/nominate failed!`, err)
        setDone({
          ...done,
          stepThree: 'error',
          submitting: false
        })
      })
  }

  const reset = () => {
    setNominee({})
    setSelected({
      type: selected.type,
      section: selected.section,
      categories: []
    })
    setDone({
      stepTwo: false,
      stepThree: false,
      submitting: false
    })
  }

  // useEffect(() => {
  //   let category = selected.category
  //   if (category && href === '')
  //     navigate(`/nominate/${slug(category.name.toLowerCase())}`)
  //   else if (!category && href !== '' && clicked) navigate(`/nominate`)
  // }, [selected, href, clicked])

  // useEffect(() => {
  //   if (!categories || href === '' || selected) return
  //   let preselected = categories.find(item => item.slug === href)
  //   if (preselected) select(preselected)
  // }, [categories, href, selected, select])

  if (categories.length === 0 || categoryTypes.length === 0)
    return (
      <LoadingIndicator timeout={1000}>
        <h4>Just a moment!</h4>
        <h6 className='text-muted'>
          We're fetching the category data for you.
        </h6>
      </LoadingIndicator>
    )

  return (
    <div className='nomination-flow'>
      <CategoryTypeSelect
        types={categoryTypes}
        hidden={selected.type ? true : false}
        selected={selected.type || null}
        select={(type, section) => {
          setSelected({
            type: type,
            section: section,
            categories: []
          })
          setNominee({})
        }}
      />

      {selected.type && (
        // = Step Two =
        <div
          id='step-two'
          className={
            'fade-rise' +
            (done.stepTwo ? ' hidden' : '')
          }
        >
          {selected.categories.length === 0 && !done.stepTwo && (
            <JumpTo id='step-two' />
          )}
          <h5>
            <GoBack
              disabled={done.stepTwo}
              onClick={() => {
                setSelected({
                  type: null,
                  section: null,
                  categories: []
                })
              }}
            />
            <small className='text-muted'>Step 2</small>
          </h5>
          
          <h4>Select a category</h4>
          <SelectCategory
            multiple={selected.type === 'other' ? false : true}
            collections={collections[selected.section]}
            categories={categories.filter(c => c.type === selected.type)}
            selected={selected.categories}
            select={category => {
              if (selected.type === 'other') {
                setSelected({
                  ...selected,
                  categories: [category]
                })
                setDone({
                  ...done,
                  stepTwo: true
                })
              } else {
                setSelected({
                  ...selected,
                  categories: [...selected.categories, category]
                })
              }
            }}
            deselect={category => {
              if (selected.type === 'other') {
                setSelected({
                  ...selected,
                  categories: []
                })
              } else {
                setSelected({
                  ...selected,
                  categories: selected.categories.filter(
                    c => c.id !== category.id
                  )
                })
              }
            }}
            done={done.stepTwo}
            setDone={() => setDone({ ...done, stepTwo: true })}
          />
        </div>
      )}

      {done.stepTwo && (
        // = Step Three =
        <div
          id='step-three'
          className={
            'fade-rise max-width' +
            (done.stepThree ? ' hidden' : '')
          }
        >
          {!done.stepThree && <JumpTo id='step-three' />}
          <h5>
            <GoBack
              disabled={done.stepThree || done.submitting}
              onClick={() => {
                if (selected.type === 'other') setSelected({ ...selected, categories: [] })
                setDone({
                  ...done,
                  stepTwo: false
                })
              }}
            />
            <small className='text-muted'>Step 3</small>
          </h5>

          <h4>
            Enter your{' '}
            {selected.type === 'other' ?
              (selected.categories[0].title
                ? `${selected.categories[0].title} `
                : '')
              : selected.type}{' '}
            nominee
          </h4>
          <InputMain
            save={dataToSave => {
              save(dataToSave)
              submit(dataToSave)
            }}
            nominee={nominee}
            setNominee={setNominee}
            type={selected.type}
            category={selected.categories[0]}
            disabled={done.stepThree}
            submitting={done.submitting}
          />
        </div>
      )}

      {done.stepThree && (
        <SubmitStep
          reset={reset}
          selected={selected}
          error={done.stepThree === 'error'}
          nominee={nominee}
        />
      )}
      <div className='vertical-padding'></div>
    </div>
  )

}

export default NominationPage
