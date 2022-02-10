import getComputedValue from './getComputedValue'

const getMapOfValues = (contest, data) => {
  const values = new Map(
    contest.fields.map((field) => {
      if (field.computed) return [field.id, getComputedValue(field.value, data)]
      if (field.hidden) return [field.id, null]
      return [field.id, data[field.id]]
    })
  )
  return values
}

export default getMapOfValues