import getComputedValue from './getComputedValue'

const getMapOfValues = (contest, data) => {
  if (!contest.fields) return new Map()
  const values = new Map(
    contest.fields.map((field) => {
      let fieldData = data[field.id]
      if (!fieldData && !field.computed) return [null, null]
      if (field.hidden) return [null, null]
      if (field.computed) return [field.id, getComputedValue(field.value, data)]
      return [field.id, fieldData]
    })
  )
  values.delete(null)
  return values
}

export default getMapOfValues
