import React, { useState, useEffect } from 'react'
import { addedDiff, detailedDiff } from 'deep-object-diff'
import { Button } from 'react-bootstrap'
import ReactJson from 'react-json-view'
import ListOfOtherCategories from './ListOfOtherCategories'
import ListOfDuplicates from './ListOfDuplicates'
import StatusDropdown, { MultiStatusDropdown } from './StatusDropdown'
import SelectionCheckbox from './SelectionCheckbox'
import OtherCard from '../cards/OtherCard'
import FicCard from '../cards/FicCard'
import ArtCard from '../cards/ArtCard'
import CriteriaContent from '../util/CriteriaContent'

const VetNomineeInterface = ({
  nominee,
  category,
  data,
  getNomineeData,
  updateNomineeData,
  select,
}) => {
  const [nomineeBeingEdited, setNomineeBeingEdited] = useState(nominee.id)
  const [checkedCategories, setCheckedCategories] = useState({})
  const [nomineeEdits, setNomineeEdits] = useState(null)
  const [containsNullValue] = useState(false)

  useEffect(() => setNomineeBeingEdited(nominee.id), [nominee])

  useEffect(() => {
    if (!nominee?.id) return
    //* Reset data when the nominee changes
    if (nominee.id !== nomineeBeingEdited || !nomineeBeingEdited) {
      setNomineeBeingEdited(nominee.id)
      setCheckedCategories({})
      setNomineeEdits(null)
    }
  }, [nominee, nomineeBeingEdited])

  //* Utility functions
  const getApprovalStatus = number => {
    if (number === -1) return 'Rejected'
    if (number === 0) return 'Unvetted'
    if (number === 1) return 'Approved'
    if (number === 2) return 'Selected via typeahead'
    return 'Unvetted' // default fallback
  }

  const getStatusValue = change => {
    if (change === 'approve') return 1
    if (change === 'reject') return -1
    if (change === 'reset') return 0
    return 0 // default fallback
  }

  const getDataOfNomineeToUpdate = id => {
    if (!id || id === nominee.id) return nominee
    return DUPLICATES.find(dupe => dupe.id === id)
  }

  //* Update data functions
  const clearEdits = () => setNomineeEdits(null)

  const updateStatus = ({ id, catId }, status) => {
    let nomineeToUpdate = getDataOfNomineeToUpdate(id)
    let newStatusValue = getStatusValue(status)
    nomineeToUpdate.statuses[catId] = newStatusValue
    nomineeToUpdate.statusChanges = [
      { category: catId, status: newStatusValue },
    ]
    updateNomineeData([nomineeToUpdate], 'status')
  }

  const updateAllStatuses = (status, type = 'nominee') => {
    let newStatusValue = getStatusValue(status)
    let nomineeCategories = Object.keys(nominee.statuses)
    let nomineesWithStatuses = []

    const getStatusChanges = key => ({
      category: parseInt(key),
      status: newStatusValue,
    })
    const loopOverNominees = (array, filterFn = null) => {
      if (!array || !array.length) return
      array.forEach(item => {
        let statuses = { ...item.statuses }
        let keys = Object.keys(item.statuses)
        let statusChanges = (filterFn ? keys.filter(filterFn) : keys).map(
          getStatusChanges
        )
        statusChanges.forEach(
          change => (statuses[change.category] = newStatusValue)
        )
        nomineesWithStatuses.push({ ...item, statuses, statusChanges })
      })
    }

    // Update all non-current statuses for the current nominee.
    if (type === 'nominee')
      loopOverNominees([nominee], key => key !== `${category.id}`)
    // Update all shared statuses for detected duplicates.
    if (type === 'duplicates')
      loopOverNominees(DUPLICATES, key => nomineeCategories.includes(key))
    // Update all statuses for checked nominee/category pairs.
    if (type === 'checked') {
      Object.entries(checkedCategories).forEach(([nomId, values]) => {
        loopOverNominees(
          [getDataOfNomineeToUpdate(parseInt(nomId))],
          key => values[key]
        )
      })
    }

    if (nomineesWithStatuses.length === 0) return
    if (type === 'checked')
      updateNomineeData(nomineesWithStatuses, 'status', () =>
        setCheckedCategories({})
      )
    else updateNomineeData(nomineesWithStatuses, 'status')
  }

  const updateData = event => {
    let nomineeToUpdate = getDataOfNomineeToUpdate()
    let newData = {
      ...nomineeToUpdate,
      data: nomineeEdits || nomineeToUpdate.data,
    }
    updateNomineeData([newData], 'data', clearEdits)
  }

  const updateDataIncludingDuplicates = event => {
    let nomineeToUpdate = getDataOfNomineeToUpdate()
    let newData = nomineeEdits || nomineeToUpdate.data
    const formatNomineeData = nom => ({ ...nom, data: newData })

    let nomineesBeingUpdated = [formatNomineeData(nomineeToUpdate)]
    DUPLICATES.forEach(dupe => {
      nomineesBeingUpdated.push(formatNomineeData(dupe))
    })

    updateNomineeData(nomineesBeingUpdated, 'data', clearEdits)
  }

  //* Make an edit
  const makeEdit = (values, replace = false, diff = null) => {
    const newData = values.updated_src || values
    const originalData = nominee.data
    let newNomineeRaw = replace
      ? newData
      : !nomineeEdits
      ? { ...originalData, ...newData }
      : { ...nomineeEdits, ...newData }
    const newNominee = newNomineeRaw
    if (!newNominee) return false

    const calculateTotalDifferenceCount = (total, val) =>
      total + Object.values(val).length

    const originalDataDiff = detailedDiff(originalData, newNominee)
    const originalDataChanges = Object.values(originalDataDiff).reduce(
      calculateTotalDifferenceCount,
      0
    )
    if (originalDataChanges === 0) {
      setNomineeEdits(null)
      return true
    }

    const previousEditDiff = detailedDiff(nomineeEdits, newNominee)
    const previousEditChanges = Object.values(previousEditDiff).reduce(
      calculateTotalDifferenceCount,
      0
    )
    if (previousEditChanges === 0) {
      return true
    }

    setNomineeEdits(newNominee)
  }

  const toggleBooleanValue = key => {
    let newData = { ...(nomineeEdits ? nomineeEdits : nominee?.data) }
    if (newData.hasOwnProperty(key) && newData[key] !== false)
      delete newData[key]
    else newData[key] = true
    makeEdit(newData, true)
  }

  const checkCategory = (nomId, catId) => {
    let checked = { ...checkedCategories }

    if (!checked[nomId]) checked[nomId] = {}
    if (checked[nomId][catId]) delete checked[nomId][catId]
    else checked[nomId][catId] = true

    if (Object.values(checked[nomId]).length === 0) delete checked[nomId]
    setCheckedCategories(checked)
  }

  const addKeyToData = values =>
    makeEdit(
      { ...values.existing_src },
      true,
      addedDiff(values.existing_src, values.updated_src)
    )

  //* Calculated values
  const approvalStatus = getApprovalStatus(nominee.statuses[category.id])
  const type = nominee.data.artist
    ? 'art'
    : nominee.data.links
    ? 'fic'
    : 'other'
  const CARD =
    type === 'other' ? (
      <OtherCard data={nomineeEdits || nominee.data} contest={category} />
    ) : type === 'art' ? (
      <ArtCard formData={nomineeEdits || nominee.data} contest={category} />
    ) : (
      <FicCard fic={nomineeEdits || nominee.data} contest={category} />
    )
  const DUPLICATES = (nominee.duplicates || []).map(getNomineeData)
  const CATEGORIES = Object.keys(nominee.statuses || {})
    .filter(cat => {
      if (Number.isInteger(cat)) return cat !== category.id
      return parseInt(cat) !== category.id
    })
    .map(cat => data.categories[cat])
  const checkedCategoryCount = Object.values(checkedCategories).reduce(
    (acc, curr) => {
      return (acc += Object.values(curr).length)
    },
    0
  )
  const isInCurrentCategory = nominee.statuses.hasOwnProperty(category.id)

  return (
    <div className='nominee-vet-ui'>
      <div
        className='nominee-controls'
        style={{ marginBottom: nominee.parent && '30px' }}
      >
        <div>
          {nominee.parent && (
            <button className='return-to-parent-btn' onClick={() => select()}>
              <>
                {'<'} Return to original selection (ID{' '}
                <code>{nominee.parent.id}</code>)
              </>
            </button>
          )}
          {isInCurrentCategory && (
            <>
              <div className='nominee-buttons'>
                <StatusDropdown
                  status={nominee.statuses[category.id]}
                  select={updateStatus}
                  catId={category.id}
                  id={nominee.id}
                  size='lg'
                  className='primary-status-dropdown'
                />
              </div>
              <div className='nominee-header-text'>
                <h2>
                  Viewing nominee <code>{nominee.id}</code> in{' '}
                  <code>{category.name}</code>
                </h2>
                <h3 className='text-muted'>
                  Current approval status:{' '}
                  <code
                    className={
                      approvalStatus === 'Rejected'
                        ? 'status-rejected'
                        : approvalStatus === 'Approved'
                        ? 'status-approved'
                        : 'status-unvetted'
                    }
                  >
                    {approvalStatus}
                  </code>
                </h3>
              </div>
              {checkedCategoryCount > 0 && (
                <MultiStatusDropdown
                  className='checkbox-status-select'
                  text={`Set Status for ${checkedCategoryCount} Selected`}
                  select={statusChange =>
                    updateAllStatuses(statusChange, 'checked')
                  }
                />
              )}
              <SelectionCheckbox
                value={checkedCategories?.[nominee.id]?.[category.id]}
                onClick={() => checkCategory(nominee.id, category.id)}
              />
            </>
          )}
          {!isInCurrentCategory && (
            <>
              <div className='nominee-header-text'>
                <h2>
                  Viewing duplicate nominee <code>{nominee.id}</code>
                </h2>
                <h3 className='text-muted'>
                  This nominee is not entered into <code>{category.name}</code>
                </h3>
              </div>
              {checkedCategoryCount > 0 && (
                <MultiStatusDropdown
                  className='checkbox-status-select'
                  text={`Set Status for ${checkedCategoryCount} Selected`}
                  select={statusChange =>
                    updateAllStatuses(statusChange, 'checked')
                  }
                />
              )}
            </>
          )}
        </div>

        <details className='nominee-category-description'>
          <summary>
            View category description {category.criteria ? 'and criteria' : ''}
          </summary>
          <h4>Description</h4>
          <p>{category.description}</p>
          {category.criteria && (
            <>
              <h4>Criteria</h4>
              <CriteriaContent criteria={category.criteria} />
            </>
          )}
        </details>
      </div>

      <div className='nominee-left-column'>
        <div>
          <div className='section-head'>
            <h3>Other categories</h3>
            {CATEGORIES.length > 0 && (
              <MultiStatusDropdown
                select={statusChange => updateAllStatuses(statusChange)}
              />
            )}
          </div>
          <ol className='nominee-categories'>
            {CATEGORIES.length > 0 && (
              <ListOfOtherCategories
                nominee={nominee}
                categories={CATEGORIES}
                updateStatus={updateStatus}
                checkCategory={checkCategory}
                checkedCategories={checkedCategories}
              />
            )}
            {CATEGORIES.length === 0 && (
              <p style={{ marginLeft: '8px' }}>
                This nominee was not entered into any other categories.
              </p>
            )}
          </ol>
        </div>

        <div className='nominee-card'>
          <div className='section-head'>
            <h3>Card view</h3>
            {nomineeEdits && (
              <h3 className='unsaved-edits-alert'>Showing unsaved edits!</h3>
            )}
          </div>
          {CARD}
        </div>
      </div>

      <div className='nominee-right-column'>
        <div className='nominee-duplicates'>
          <div className='section-head'>
            <h3>Duplicates</h3>
            {DUPLICATES.length > 0 && (
              <MultiStatusDropdown
                select={statusChange =>
                  updateAllStatuses(statusChange, 'duplicates')
                }
                text='Set Shared'
              />
            )}
          </div>
          {DUPLICATES.length > 0 && (
            <>
              <p>
                Remember to manually check other nominees for non-identical
                duplicates.
              </p>
              <ListOfDuplicates
                validCategories={nominee.statuses}
                allCategories={data.categories}
                updateStatus={updateStatus}
                duplicates={DUPLICATES}
                checkCategory={checkCategory}
                checkedCategories={checkedCategories}
                select={select}
              />
            </>
          )}
          {DUPLICATES.length === 0 && (
            <>
              <p>
                No identical duplicates were found to share categories with this
                nominee.
              </p>
              <p>
                You'll have to manually check other nominees for non-identical
                duplicates.
              </p>
            </>
          )}
        </div>
      </div>

      <div className='nominee-json'>
        <div className='section-head'>
          <h3>Data tree</h3>
        </div>
        <div className='json-edit-buttons'>
          {category.type !== 'other' && (
            <Button
              onClick={() => toggleBooleanValue('nsfw')}
              variant='outline-dark'
            >
              Toggle <code>NSFW</code> flag
            </Button>
          )}
          {category.type === 'art' && (
            <Button
              onClick={() => toggleBooleanValue('spoiler')}
              variant='outline-dark'
            >
              Toggle <code>SPOILER</code> flag
            </Button>
          )}
        </div>
        <ReactJson
          src={nomineeEdits || nominee.data}
          displayDataTypes={false}
          enableClipboard={false}
          quotesOnKeys={false}
          onEdit={makeEdit}
          onAdd={addKeyToData}
          onDelete={values => makeEdit(values, true)}
          name={null}
        />
        {containsNullValue && (
          <div className='json-error-text'>
            Note: you cannot save your changes while you have a null value.
          </div>
        )}
        {!!nomineeEdits && (
          <div className='json-submit-buttons'>
            {!containsNullValue && (
              <>
                {DUPLICATES.length > 0 && (
                  <Button onClick={updateDataIncludingDuplicates}>
                    Save changes for this & duplicates
                  </Button>
                )}
                <Button
                  onClick={updateData}
                  variant={DUPLICATES.length > 0 ? 'dark' : 'primary'}
                >
                  Save changes
                </Button>
              </>
            )}
            <Button onClick={() => setNomineeEdits(null)} variant='danger'>
              Discard changes
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default VetNomineeInterface
