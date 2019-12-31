import React, { useState, useEffect } from 'react'
import { navigate } from '@reach/router'
import slug from 'slug'
import SelectCategory from '../components/nominate/SelectCategory'
import InputMain from '../components/nominate/InputMain'

const NominationPage = props => {
  const [selected, setSelected] = useState(null)
  const [clicked, setClicked] = useState(false)
  const href = props['*']

  useEffect(() => {
    if (selected && href === '')
      navigate(`/nominate/${slug(selected.name.toLowerCase())}`)
    else if (!selected && href !== '' && clicked) navigate(`/nominate`)
  }, [selected, href, clicked])

  const select = category => {
    setSelected(category)
    setClicked(true)
  }

  const deselect = () => {
    setSelected(null)
    setClicked(true)
    window.scrollTo(0, 0)
  }

  // const navigateTo = target => {
  //   if (target === 'step1') setSelected(null)
  //   else setPreselected(target)
  // }

  return (
    <div className='nomination-flow'>
      <SelectCategory
        hidden={selected ? true : false}
        select={select}
        selected={selected}
        href={!clicked ? href : null}
      />
      {selected && (
        <div id='input-main' className='fade-rise'>
          <hr></hr>
          <InputMain select={select} deselect={deselect} category={selected} />
          <div className='vertical-padding'></div>
        </div>
      )}
    </div>
  )
}

export default NominationPage
