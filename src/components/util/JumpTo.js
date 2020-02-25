import React, { useEffect } from 'react'
import jumpToId from '../../functions/jumpToID'

const JumpTo = ({ id, offset, smooth, onJump }) => {
  useEffect(() => {
    jumpToId(id, {
      offset: offset,
      smooth: smooth
    })
    if (onJump) onJump()
  }, [id, offset, smooth, onJump])

  return <></>
}

export default JumpTo
