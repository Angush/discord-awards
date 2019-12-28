import React from 'react'

const padWithEmptyElements = (array, MAX_PER_ROW, className) => {
  let needed = (1 - ((array.length / MAX_PER_ROW) % 1)) * MAX_PER_ROW
  let arr = [needed]
  return arr.map((item, index) => {
    return <div className={className} key={index}></div>
  })
}

export default padWithEmptyElements
