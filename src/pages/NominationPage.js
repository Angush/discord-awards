import React, { useState, useEffect } from 'react'
import LoadingIndicator from '../components/util/LoadingIndicator'
import CategoryTypeSelect from '../components/nominate/CategoryTypeSelect'
import SelectCategory from '../components/nominate/SelectCategory'
import SubmitStep from '../components/nominate/SubmitStep'
import InputMain from '../components/nominate/InputMain'
import JumpTo from '../components/util/JumpTo'
import GoBack from '../components/util/GoBack'
// import slug from 'slug'

// ! hardcoded contest data for testing without an api
const rawContestData = require('../json/FanficContests.json')

const NominationPage = props => {
  const [categoryTypes, setCategoryTypes] = useState([])
  const [categories, setCategories] = useState([])
  const [nominee, setNominee] = useState(null)
  const [selected, setSelected] = useState({
    type: null,
    categories: []
  })
  const [done, setDone] = useState({
    stepTwo: false,
    stepThree: false
  })

  // const [clicked, setClicked] = useState(false)
  // const href = props['*']

  useEffect(() => {
    // ! hardcoded contest data for testing without an api
    // - remove this line (and declaration above) and uncomment the fetch request here when done
    let data = rawContestData
    // window
    //   .fetch(`http://localhost:3001/api/contests`)
    //   .then(response => response.json())
    //   .then(data => {
    // set category types
    let types = data.reduce(
      (arr, { type }) => (arr.includes(type) ? arr : [...arr, type]),
      []
    )
    setCategories(data)
    setCategoryTypes(types)
    // })
  }, [])

  const save = nomineeData => {
    console.log(nomineeData)
    setNominee(nomineeData)
    setDone(
      selected.type === 'other'
        ? {
            ...done,
            stepThree: true
          }
        : {
            ...done,
            stepTwo: true
          }
    )
  }

  const reset = stage => {
    setNominee(null)
    setSelected({
      type: null,
      categories: []
    })
    setDone({
      stepTwo: false,
      stepThree: false
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

  if (!categories || !categoryTypes)
    return (
      <LoadingIndicator timeout={1000}>
        <h4>Just a moment!</h4>
        <h6 className='text-muted'>
          We're fetching the category data for you.
        </h6>
      </LoadingIndicator>
    )

  // const select = category => {
  //   setSelectedCategory(category)
  //   setClicked(true)
  // }

  // const deselect = () => {
  //   setSelectedCategory(null)
  //   setClicked(true)
  //   window.scrollTo(0, 0)
  // }

  // const navigateTo = target => {
  //   if (target === 'step1') setSelectedCategory(null)
  //   else setPreselected(target)
  // }

  // TODO: add support for addition of "hidden" className to the GoBack / Step X part of the UI.
  // - Perhaps best achieved by moving the GoBack / Step X elements to the NominateOther/NominateMain sections, and passing a back() function through as a prop?
  // ! Best way to do hidden: move all components here, with data to infer hidden status

  return (
    <div className='nomination-flow'>
      <CategoryTypeSelect
        types={categoryTypes}
        hidden={selected.type ? true : false}
        selected={selected.type || null}
        select={type => {
          setSelected({
            type: type,
            categories: []
          })
        }}
      />

      {selected.type && (
        // = Step Two =
        <div
          id='step-two'
          className={
            'fade-rise' +
            (done.stepTwo ? ' hidden' : '') +
            (selected.type === 'other' ? '' : ' max-width')
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
                  categories: []
                })
              }}
            />
            <small className='text-muted'>Step 2</small>
          </h5>

          {selected.type === 'other' ? (
            // * Step 2 for Other nomination: category selection
            <>
              <h4>Select a category</h4>
              <SelectCategory
                categories={categories.filter(c => c.type === 'other')}
                selected={selected.categories}
                select={category => {
                  setSelected({
                    ...selected,
                    categories: [category]
                  })
                  setDone({
                    ...done,
                    stepTwo: true
                  })
                }}
                deselect={category => {
                  setSelected({
                    ...selected,
                    categories: []
                  })
                }}
                done={done.stepTwo}
              />
            </>
          ) : (
            // * Step 2 for Fic/Art nomination: data entry
            <>
              <h4>Enter your {selected.type} nominee</h4>
              <InputMain
                save={save}
                type={selected.type}
                disabled={done.stepTwo}
              />
            </>
          )}
        </div>
      )}

      {done.stepTwo && (
        // = Step Three =
        <div
          id='step-three'
          className={
            'fade-rise' +
            (done.stepThree ? ' hidden' : '') +
            (selected.type === 'other' ? ' max-width' : '')
          }
        >
          {!done.stepThree && <JumpTo id='step-three' />}
          <h5>
            <GoBack
              disabled={done.stepThree}
              onClick={() => {
                setSelected({
                  ...selected,
                  categories: []
                })
                setDone({
                  ...done,
                  stepTwo: false
                })
              }}
            />
            <small className='text-muted'>Step 3</small>
          </h5>

          {selected.type === 'other' ? (
            // * Step 3 for Other nomination: data entry
            <>
              <h4>
                Enter your{' '}
                {selected.categories[0].title
                  ? `${selected.categories[0].title} `
                  : ''}
                nominee
              </h4>
              <InputMain
                save={save}
                type={selected.type}
                category={selected.categories[0]}
                disabled={done.stepThree}
              />
            </>
          ) : (
            // * Step 3 for Fic/Art nomination: category selection(s)
            <>
              <h4>Select your nominee's categories</h4>
              <SelectCategory
                multiple={true}
                categories={categories.filter(c => c.type === selected.type)}
                selected={selected.categories}
                select={category => {
                  setSelected({
                    ...selected,
                    categories: [...selected.categories, category]
                  })
                }}
                deselect={category => {
                  setSelected({
                    ...selected,
                    categories: selected.categories.filter(
                      c => c.id !== category.id
                    )
                  })
                }}
                done={done.stepThree}
                setDone={status =>
                  setDone({
                    ...done,
                    stepThree: status
                  })
                }
              />
            </>
          )}
        </div>
      )}

      {done.stepThree && (
        <SubmitStep
          selected={selected}
          nominee={nominee}
          reset={reset}
          goBack={() => {
            setDone({
              ...done,
              stepThree: false
            })
          }}
        />
      )}
      <div className='vertical-padding'></div>
    </div>
  )
}

export default NominationPage
