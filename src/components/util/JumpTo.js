import React, { useEffect } from 'react'
import jumpToId from '../../functions/jumpToID'

const JumpTo = ({ id, offset, smooth, onJump, focus }) => {
  useEffect(() => {
    let element = document.querySelector(`#${id}`)
    if (!element) return
    jumpToId(id, {
      offset: offset,
      smooth: smooth
    })
    if (onJump) onJump()
    if (focus) {
      element.focus()
      element.blur()
    }
  }, [id, offset, smooth, onJump, focus])

  return <></>
}

export default JumpTo
