import React, { useState } from 'react'
import { navigate } from '@reach/router'
import slug from 'slug'
import SelectCategory from '../components/nominate/SelectCategory'
import InputMain from '../components/nominate/InputMain'

const NominationPage = () => {
  const [selected, setSelected] = useState(null)

  const select = category => {
    setSelected(category)
    navigate(`/nominate/${slug(category.name.toLowerCase())}`)

    // = Potential use for slugs =
    // Perhaps add pre-determined slugs to the raw data, so the slug
    // library isn't needed. That way, we can also use slugs as IDs,
    // and as query params, so if someone opens the app to a certain
    // slug (like "/nominate/fic-of-the-year"), we can automatically
    // select that category and jump straight to fic selection, once
    // the category data has been loaded.
  }

  const deselect = () => {
    setSelected(null)
    navigate('/nominate')
    window.scrollTo(0, 0)
  }

  return (
    <div className='nomination-flow'>
      <SelectCategory
        hidden={selected ? true : false}
        select={select}
        selected={selected}
      />
      {selected && (
        <div id='input-main' className='fade-rise'>
          <hr></hr>
          <InputMain select={select} deselect={deselect} selected={selected} />
          <div className='vertical-padding'></div>
        </div>
      )}
    </div>
  )
}

export default NominationPage
