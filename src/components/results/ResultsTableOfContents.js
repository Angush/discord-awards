import React, { useState } from 'react'
import TableOfContents from '../util/TableOfContents'
import { Button } from 'react-bootstrap'

const ResultsTableOfContents = ({ toc }) => {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <TableOfContents
        items={toc}
        fadeIn={false}
        isOpen={expanded}
        closeMenu={() => setExpanded(false)}
      />
      <div
        className={expanded ? 'toc-click expanded' : 'toc-click'}
        onClick={() => setExpanded(!expanded)}
      ></div>
      <div id='floating-toc-btn'>
        <Button
          id='open-toc'
          variant='light'
          onClick={() => setExpanded(!expanded)}
        >
          <img
            alt='Toggle table of contents'
            fill='black'
            src='/images/list.svg'
            width='42px'
            height='42px'
          />
        </Button>
      </div>
    </>
  )
}

export default ResultsTableOfContents