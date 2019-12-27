import React from 'react'

const padWithEmptyElements = (array, MAX_PER_ROW, className) => {
  let needed = (1 - ((array.length / MAX_PER_ROW) % 1)) * MAX_PER_ROW
  console.log(
    `Array has ${array.length} elements. Max number of elements per row is ${MAX_PER_ROW}. We need ${needed} elements to fully pad.`
  )
  let arr = [needed]
  return arr.map((item, index) => {
    return <div className={className} key={index}></div>
  })
}

export default padWithEmptyElements
