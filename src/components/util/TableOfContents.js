import React, { useState, useEffect } from 'react'
import useWidth from '../../functions/useWidth'
import JumpTo from './JumpTo'

const TableOfContents = ({ items, isOpen, closeMenu, offsets = [] }) => {
  const [target, setTarget] = useState(undefined)
  const [offset, setOffset] = useState(undefined)
  const width = useWidth()

  // = Calculate offset based on width and provided offset breakpoints = \\
  useEffect(() => {
    if (offsets.length === 0) return
    let defaultOption = offsets.filter(o => o.default)
    let options = offsets
      .filter(o => o.breakpoint >= width)
      .sort((a, b) => a.breakpoint - b.breakpoint)

    if (options.length === 0) {
      if (defaultOption.length > 0) setOffset(defaultOption[0].distance)
    } else {
      setOffset(options[0].distance)
    }
  }, [offsets, width])

  // = If there are no items, display empty placeholder TOC = \\
  // * If you have no items and don't want a placeholder, use a conditional render in the parent element * \\
  if (!items || items.length === 0)
    return (
      <ul className='toc'>
        <div
          style={{
            height: '200vh',
            width: '100%'
          }}
        ></div>
      </ul>
    )

  const selectTOCItem = anchor => {
    setTarget(anchor)
    closeMenu()
  }

  return (
    <>
      {target && (
        <JumpTo
          id={target.replace(/^#/, '')}
          onJump={selectTOCItem}
          offset={offset}
          // focus={true}
        />
      )}
      <ul className={isOpen ? 'toc expanded' : 'toc'}>
        {items &&
          items.map(section => (
            <React.Fragment key={section.anchor}>
              <li
                className='toc-entry fade-rise'
                onClick={() => selectTOCItem(section.anchor)}
              >
                {section.text}
              </li>
              <ol>
                {section.children.map(child => (
                  <li
                    key={child.anchor}
                    onClick={() => selectTOCItem(child.anchor)}
                  >
                    {child.text}
                  </li>
                ))}
              </ol>
            </React.Fragment>
          ))}
      </ul>
    </>
  )
}

export default TableOfContents
