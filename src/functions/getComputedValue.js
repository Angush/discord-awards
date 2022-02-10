const getComputedValue = (template = '', data) => {
  const types = Array.from(template.matchAll(/{(\w+)}/g))
  let computedValue = template
  types.forEach((match) => {
    let matchValue = data[match[1]]
    if (matchValue)
      computedValue = computedValue.replace(match[0], matchValue.trim())
  })
  return computedValue
}

export default getComputedValue
