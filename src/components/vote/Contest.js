import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import ContestEntries from './ContestEntries'
import jumpToID from '../../functions/jumpToID'

const Contest = ({
  contest,
  mode,
  select,
  isSelected,
  votes = 0,
  changes = []
}) => {
  const [collapsedChanges, setCollapsedChanges] = useState(true)
  const [collapsed, setCollapsed] = useState(true)
  let count = contest.entries ? contest.entries.length : 0
  let countText = `${count} nominee${count !== 1 && 's'}`
  let changeCount = changes.length

  const collapse = event => {
    let element = document.querySelector(`#${contest.anchor}`)
    if (!collapsed && element && window.scrollY + 56 > element.offsetTop) {
      jumpToID(contest.anchor, { smooth: false })
    }
    setCollapsed(!collapsed)
    event.target.blur()
  }

  return (
    <div id={contest.anchor} className='category'>
      <h5>
        <small className='text-muted'>
          <span className='category-votes-count'>
            {votes > 0 ? votes : 'No'} vote{votes === 1 ? '' : 's'} lodged
          </span>
          {changeCount > 0 && (
            <>
              <span className='slash-divider'> | </span>
              <span
                className='unsubmitted-count'
                onClick={() => {
                  setCollapsedChanges(!collapsedChanges)
                }}
              >
                {changeCount} unsubmitted change{changeCount === 1 ? '' : 's'}
              </span>
            </>
          )}
        </small>
      </h5>
      {!collapsedChanges && changes.length > 0 && (
        <ol>{changes.map(c => c)}</ol>
      )}
      <h4>{contest.name}</h4>
      <h6>{contest.description}</h6>
      <Button
        variant={collapsed ? 'outline-info' : 'info'}
        className='contest-collapser'
        onClick={collapse}
      >
        {collapsed ? `Expand` : `Collapse`} {countText}
      </Button>
      {count > 0 && !collapsed && (
        <ContestEntries
          contest={contest}
          mode={mode}
          select={select}
          isSelected={isSelected}
        />
      )}
    </div>
  )
}

export default Contest
