import React from 'react'

const padWithEmptyElements = (array, MAX_PER_ROW, className) => {
  let needed = !array
    ? MAX_PER_ROW
    : (1 - ((array.length / MAX_PER_ROW) % 1)) * MAX_PER_ROW
  let elements = []
  for (let el = 0; el < needed; el++) {
    elements.push(
      <div
        className={className}
        key={`${className.replace(/[\s\/\\]+/g, '-')}-${el}`}
      ></div>
    )
  }
  return elements
}

export default padWithEmptyElements
