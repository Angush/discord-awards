import React from 'react'
import { Link } from '@reach/router'

const CategoryInfo = ({ data: { id, name, type, description } }) => {
  return (
    <div className='entry'>
      <h3>{name}</h3>
      <h4>
        <strong>Type:</strong> {type}
      </h4>
      <p>{description}</p>
      <Link to={`/nominate/${id}`}>Nominate something for this category!</Link>
    </div>
  )
}

export default CategoryInfo
