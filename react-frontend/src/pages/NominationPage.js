import React, { useState } from 'react'
import CategorySelect from '../components/nominate/CategorySelect'

const NominationPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null)

  return (
    <div className='nomination-flow'>
      <CategorySelect hidden={selectedCategory ? true : false} />
      <p className='text-center'>
        <a onClick={() => setSelectedCategory(!selectedCategory)} href='#z'>
          Click me!
        </a>
      </p>
    </div>
  )
}

export default NominationPage
