import React, { Suspense } from 'react'
import LoadingIndicator from '../components/util/LoadingIndicator'

const AdminVettingPage = React.lazy(() => import('./AdminVettingPage'))

const AdminVettingPageWrapper = props => {
  return (
    <Suspense fallback={
      <LoadingIndicator className='fade-rise' timeout={1000}>
        <h4>Just a moment!</h4>
        <h6 className='text-muted'>We're loading the vetting page.</h6>
      </LoadingIndicator>
    }>
      <AdminVettingPage {...props} />
    </Suspense>
  )
}

export default AdminVettingPageWrapper
