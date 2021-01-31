import React from 'react'
import Badge from './Badge'
import StatusDropdown from './StatusDropdown'

const ItemList = ({ items, select, selectedItem, updateStatus, parentId, depth = 1 }) => {
  return (
    <div className={`item-list list-${depth}${selectedItem ? ' selected-list' : ''}`}>
      {items.map(item => {
        if (item.IS_HEADER) return (
          <div className='item-list-section' key={`${item.header}-HEADER`}>
            {item.header}
          </div>
        )
        
        const isSelected = item.id === selectedItem?.id

        const DUPE_COUNT = item.badges?.duplicates
        const DUPE_BADGE = DUPE_COUNT > 0 && (
          <Badge
            number={DUPE_COUNT}
            suffix={DUPE_COUNT === 1 ? 'dupe' : 'dupes'}
          />
        )

        const COLLECTION_TEXT = item.badges?.collection ?? null
        const COLLECTION_BADGE = COLLECTION_TEXT && (
          <Badge text={COLLECTION_TEXT} className='collection-badge' />
        )

        const STATUS = item.badges?.currentStatus
        const STATUS_SELECTOR = (Number.isInteger(STATUS) && updateStatus && parentId) && (
          <StatusDropdown
            status={STATUS}
            select={updateStatus}
            catId={parentId}
            id={item.id}
            classes='item-list-dropdown'
          />
        )

        return (
          <div
            key={`${item.header}-${item.id}`}
            className={'item-list-element' + (isSelected ? ' selected-list-element' : '')}
            onClick={e => select(isSelected ? null : item.id)}
          >
            <div className='item-list-header'>
              <h1>{item.header}</h1>
              {STATUS_SELECTOR || COLLECTION_BADGE}
            </div>
            <h2>
              <div className='text-muted'>
                {item.subheader}
              </div>
              <div className='item-badges'>
                {DUPE_BADGE}
                <code className='item-id'><span className='uncolored-code'>ID </span>{item.id}</code>
              </div>
            </h2>
          </div>
        )
      })}
    </div>
  )
}

export default ItemList