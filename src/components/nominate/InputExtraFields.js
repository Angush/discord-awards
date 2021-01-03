import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Submission from '../util/Submission'
import InputOther from './InputOther'
import { Form } from 'react-bootstrap'

const InputExtraFields = ({ categories, setExtraCategoryData, disabled, submitting }) => {
  const [extraData, setExtraData] = useState(null)
  const [validity, setValidity] = useState({})

  useEffect(() => {
    let initialExtraData = {}
    let initialValidityData = {}
    categories.forEach(cat => {
      initialExtraData[cat.id] = {}
      initialValidityData[cat.id] = false
    })
    setExtraData(initialExtraData)
    setValidity(initialValidityData)
  }, [categories])

  const updateExtraData = useCallback((newData, categoryId) => {
    let newExtraData = { ...extraData, [categoryId]: newData }
    setExtraData(newExtraData)
  }, [extraData])
  
  const updateValidity = useCallback((newStatus, categoryId) => {
    let newValidity = { ...validity, [categoryId]: newStatus }
    setValidity(newValidity)
  }, [validity])

  const propagateDataUpward = useCallback(e => {
    e.preventDefault()
    if (extraData) setExtraCategoryData(extraData)
  }, [extraData, setExtraCategoryData])

  const allValid = useMemo(() => Object.values(validity).every(value => value === true), [validity])

  if (!extraData) return <></>

  return (
    <Form onSubmit={propagateDataUpward}>
      {categories.map(cat => 
        <InputOther
          key={cat.name}
          category={cat}
          disabled={disabled || submitting}
          submitting={submitting}
          setExtraData={data => updateExtraData(data, cat.id)}
          updateValidity={data => updateValidity(data, cat.id)}
          currentValidity={validity[cat.id]}
          extraData={extraData[cat.id]}
          inline={true}
        />
      )}

      <p 
        style={{ transition: "opacity 0.1s", opacity: allValid ? 0 : 1 }}
        className='text-muted submission-alternatives' 
      >
        Enter all required data to submit.
      </p>

      <Submission
        tall
        disabled={disabled || !allValid}
        submitting={submitting}
      />
    </Form>
  )
}

// InputExtraFields.whyDidYouRender = true

export default InputExtraFields