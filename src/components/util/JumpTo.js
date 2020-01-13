import React, { useEffect } from 'react'
import jumpToId from '../../functions/jumpToID'

const JumpTo = ({ id, offset, smooth }) => {
  useEffect(() => {
    jumpToId(id, {
      offset: offset,
      smooth: smooth
    })
  }, [id, offset, smooth])

  return <></>
}

export default JumpTo
