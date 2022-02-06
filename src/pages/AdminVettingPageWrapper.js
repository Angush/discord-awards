import React, { Suspense } from 'react'
import LoadingIndicator from '../components/util/LoadingIndicator'
import NotFoundPage from './NotFoundPage'

const AdminVettingPage = React.lazy(() =>
  import(/* webpackChunkName: "AdminVetting" */ './AdminVettingPage')
)

const AdminVettingPageWrapper = (props) => {
  const { userData, links } = props
  //* Early return on invalid auth
  if (!userData.canVet && !userData.LOADED_FROM_CACHE)
    return <NotFoundPage links={links} unauthorized={true} fadeRise={true} />

  const Loading = (
    <LoadingIndicator className='fade-rise' timeout={1000}>
      <h4>Just a moment!</h4>
      <h6 className='text-muted'>We're loading the vetting page.</h6>
    </LoadingIndicator>
  )

  if (!userData.canVet) return Loading

  return (
    <Suspense fallback={Loading}>
      <AdminVettingPage />
    </Suspense>
  )
}

export default AdminVettingPageWrapper
