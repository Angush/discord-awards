import React, { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'

const Lightbox = ({ data, exit, isSelected, toggle }) => {
  const [selected, setSelected] = useState(isSelected(data.key))

  useEffect(() => {
    const scrollPos = window.scrollY
    document.body.style = {
      top: `-${scrollPos}px`,
      position: 'fixed',
      overflow: 'hidden'
    }

    return () => {
      delete document.body.style
      window.scrollTo(0, scrollPos)
    }
  }, [])

  useEffect(() => {
    setSelected(isSelected(data.key))
  }, [data, isSelected])

  return (
    <div className='lightbox'>
      <div className='lightbox-body'>
        <div className='lightbox-info'>
          <a href={data.src}>{data.identifier}</a>
          <div className='lightbox-controls'>
            <Button
              variant={selected ? 'primary' : 'outline-primary'}
              onClick={() => toggle(data.key, data.identifier)}
              text='white'
            >
              {selected ? 'Deselect' : 'Select'}
            </Button>
            <button
              type='button'
              className='lightbox-close'
              aria-label='Clear input'
              onClick={exit}
            >
              <span aria-hidden='true'>&times;</span>
            </button>
          </div>
          {/* <img className='lightbox-blurred' src={data.src} /> */}
        </div>
        <div className='lightbox-img'>
          <img src={data.src} alt={data.identifier} />
        </div>
      </div>
      <div className='lightbox-overlay' onClick={exit}></div>
    </div>
  )
}

export default Lightbox
