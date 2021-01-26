import React from 'react'
import { Link, useMatch } from '@reach/router'

const NotFoundPage = ({ links }) => {
  const match = useMatch(`/unauthorized`)

  return (
    <div className='mx-auto text-center' style={{ 
      width: 'fit-content',
      marginTop: '20vh' 
    }}>
      <h4 style={{ marginBottom: '1rem' }}>{match ? "You're not authorized!" : "Page not found!"}</h4>
      <h4 style={{ marginBottom: '24px' }}>
        <small className='text-muted'>Sorry. Try one of these...</small>
      </h4>
      {links.map((link, index) => (
        <Link to={link.to} key={index} style={{ margin: '12px' }}>
          {link.text}
        </Link>
      ))}
    </div>
  )
}

export default NotFoundPage