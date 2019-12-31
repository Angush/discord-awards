import React from 'react'
import { Link } from '@reach/router'

const NotFoundPage = ({ links }) => {
  return (
    <div className='mx-auto text-center' style={{ 
      width: 'fit-content',
      marginTop: '20vh' 
    }}>
      <h4>Page not found!</h4>
      <h4>
        <small className='text-muted'>Try one of these...</small>
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