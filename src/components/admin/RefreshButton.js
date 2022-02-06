import React from 'react'
import { Button } from 'react-bootstrap'

const RefreshButton = ({ refresh, children, disabled = false }) => {
  return (
    <Button
      variant='outline-primary'
      size='lg'
      onClick={refresh}
      disabled={disabled}
    >
      {children || 'Refresh'}
    </Button>
  )
}

export default RefreshButton
