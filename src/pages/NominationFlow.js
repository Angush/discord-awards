import React, { useState, useEffect, useCallback, useMemo } from 'react'
import LoadingIndicator from '../components/util/LoadingIndicator'
import CategoryTypeSelect from '../components/nominate/CategoryTypeSelect'
import SelectCategory from '../components/nominate/SelectCategory'
import SubmitStep from '../components/nominate/SubmitStep'
import InputMain from '../components/nominate/InputMain'
import JumpTo from '../components/util/JumpTo'
import GoBack from '../components/util/GoBack'
import InputExtraFields from '../components/nominate/InputExtraFields'

const NominationFlow = ({ categories, collections, categoryTypes }) => {  
  const [errorCode, setErrorCode] = useState(null)
  const [extraFields, setExtraFields] = useState([])
  const [extraCategoryData, setExtraCategoryData] = useState(null) // didn't actually end up using this lmao
  const [nominee, setNominee] = useState({})
  const [selected, setSelected] = useState({
    type: null,
    section: null,
    categories: []
  })
  const [done, setDone] = useState({
    stepTwo: false,
    stepThree: false,
    extraFields: false,
    submitting: false
  })

  const save = useCallback(nomineeData => {
    setNominee(nomineeData)
  }, [])

  const submit = (nomineeData = null, additionalData = null) => {
    if (!nomineeData && (!nominee || Object.values(nominee).length === 0)) return
    setDone({ ...done, submitting: true })

    let approval = 0 // 0 indicating unvetted manual input
    let editedData = nomineeData || nominee
    if (selected.type === 'fic') editedData.links = editedData.links.filter(l => l && l.length > 0)
    if (editedData.MANUAL_INPUT === false) approval = 2 // 2 indicating it was not manual input
    delete editedData.MANUAL_INPUT
    delete editedData.approval

    //* Create array of nomination objects to save
    let dataToSubmit = []
    let regularCategories = selected.type === 'fic' ? selected.categories.filter(c => !c.fields) : selected.categories
    dataToSubmit.push({ categories: regularCategories.map(c => c.id), data: editedData, approval })

    if (additionalData) extraFields.forEach(field => {
      let currentFieldData = additionalData[field.id]
      if (currentFieldData) {
        let dataToAdd = { ...editedData, ...currentFieldData }
        dataToSubmit.push({
          categories: [field.id],
          data: dataToAdd,
          approval
        })
      }
    })

    let alertOnError = () => setDone({
      ...done, stepThree: true, extraFields: true, submitFailure: true, submitting: false
    })

    window
      .fetch(`https://cauldron.angu.sh/api/nominate`, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        credentials: 'include',
        body: JSON.stringify(dataToSubmit)
      })
      .then(res => {
        if (res.status === 201) {
          setDone({
            ...done,
            stepThree: true,
            extraFields: true,
            submitting: false
          })

          //- Save updated nominees to localStorage
          let nominees = localStorage.nominees
            ? JSON.parse(localStorage.nominees)
            : []

          localStorage.nominees = JSON.stringify([
            ...nominees,
            ...dataToSubmit
          ])
        } else {
          setErrorCode(res.status)
          alertOnError()
        }
      })
      .catch(err => {
        console.error(`POST to /api/nominate failed!`, err)
        alertOnError()
      })
  }

  const reset = (resetTo = "category") => {
    let newDone = {
      stepTwo: false,
      stepThree: false,
      extraFields: false,
      submitting: false
    }
    
    switch (resetTo) {
      case "sectionSelect": {
        setSelected({ type: null, section: null, categories: [] })
        break
      }

      case "nomineeData": {
        setSelected({ ...selected, RESET: true })
        setTimeout(() => {
          setDone({ ...newDone, stepTwo: true })
        }, 50)
        break
      }
      
      case "category":
      default: {
        setSelected({
          type: selected.type,
          section: selected.section,
          categories: []
        })
        break
      }
    }
    setDone(newDone)
    setErrorCode(null)
    setExtraCategoryData(null)
    if (nominee.MANUAL_INPUT) setNominee({ MANUAL_INPUT: true })
    else setNominee({})
  }

  useEffect(() => {
    if (done.stepTwo && selected.type !== 'other' && selected.categories.length > 0) {
      let customFields = selected.categories.filter(cat => cat.fields)
      setExtraFields(customFields)
    }
  }, [done.stepTwo, selected.categories, selected.type])

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

  
  //* Callbacks & memos
  const selectThisCategory = useCallback(category => {
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
  }, [done, selected])

  const deselectThisCategory = useCallback(category => {
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
  }, [selected])

  const finishCategorySelection = useCallback(() => setDone({ ...done, stepTwo: true }), [done])

  const filteredCategories = useMemo(() => categories.filter(c => c.type === selected.type), [categories, selected.type])

  const updateExtraCategoryData = props => {
    setExtraCategoryData(props)
    setDone({ ...done, extraFields: true })
    submit(null, props)
  }

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
          
          <h4>Select your {selected.type === 'other' ? "category" : "categories"}</h4>
          <SelectCategory
            multiple={selected.type === 'other' ? false : true}
            collections={collections[selected.section]}
            categories={filteredCategories}
            selected={selected.categories}
            select={selectThisCategory}
            deselect={deselectThisCategory}
            done={done.stepTwo}
            setDone={finishCategorySelection}
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
              if (extraFields.length === 0) submit(dataToSave)
              else setDone({ ...done, stepThree: true, extraFields: false })
            }}
            nominee={nominee}
            setNominee={setNominee}
            selected={selected}
            disabled={done.stepThree}
            submitting={done.submitting}
            extraFields={extraFields.length > 0}
          />
        </div>
      )}

      {done.stepThree && extraFields.length > 0 && (
        <div
          id='step-extra-fields'
          className={
            'fade-rise max-width' +
            (done.extraFields ? ' hidden' : '')
          }
        >
          {!done.extraFields && <JumpTo id='step-extra-fields' />}
          <h5>
            <GoBack
              disabled={done.extraFields || done.submitting}
              onClick={() => {
                setDone({
                  ...done,
                  stepThree: false
                })
                setExtraCategoryData(null)
              }}
            />
            <small className='text-muted'>Step 4</small>
          </h5>

          <h4 className="extra-field-header">Additional information required</h4>
          <p>Some of your selected categories require additional information. Please enter it below.</p>

          <InputExtraFields
            categories={extraFields}
            setExtraCategoryData={updateExtraCategoryData}
            submitting={done.submitting}
            disabled={done.extraFields}
          />

        </div>
      )}

      {((done.stepThree && extraFields.length === 0) || done.extraFields) && (
        <SubmitStep
          reset={reset}
          selected={selected}
          error={done.submitFailure}
          errorCode={errorCode}
          nominee={nominee}
        />
      )}
      <div className='vertical-padding'></div>
    </div>
  )

}

export default NominationFlow