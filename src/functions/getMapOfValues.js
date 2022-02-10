import getComputedValue from './getComputedValue'

const getMapOfValues = (contest, data) => {
  if (!contest.fields) return new Map()
  const values = new Map(
    contest.fields.map((field) => {
      if (field.computed) return [field.id, getComputedValue(field.value, data)]
      if (field.hidden) return [null, null]
      return [field.id, data[field.id]]
    })
  )
  values.delete(null)
  return values
}

export default getMapOfValues
