import React, { useEffect, useState } from 'react'
import { FormControl } from 'react-bootstrap'
import StatusDropdown from './StatusDropdown'
import InputClear from '../util/InputClear'
import Badge from './Badge'

const ItemList = ({ name = 'items', items, select, selectedItem, updateStatus, parentId, depth = 1 }) => {
  const [filteredItems, setFilteredItems] = useState(items)
  const [searchterm, setSearchterm] = useState('')

  useEffect(() => {
    if (!items) return
    const exitWithDefault = () => {
      setFilteredItems(items)
      return
    }
    
    if (searchterm.length === 0) exitWithDefault()
    let regex = new RegExp(searchterm, 'gi')
    if (!regex || !regex.test) exitWithDefault()
    
    let header = null
    let newFilteredItems = []
    items.forEach(item => {
      if (item.IS_HEADER) header = item
      if (item.IS_HEADER || !item.id || !item.header || !item.subheader) return

      let fields = [`ID ${item.id}`, item.header, item.subheader]
      if (item.badges && item.badges.collection) fields.push(item.badges.collection)
      let match = fields.some(field => regex.test(field))

      if (match || (!match && selectedItem?.id === item.id)) {
        if (header) {
          newFilteredItems.push(header)
          header = null
        }
        newFilteredItems.push(item)
      }
    })
    
    setFilteredItems(newFilteredItems)
  }, [items, searchterm, selectedItem])

  return (
    <div className={`item-list list-${depth}${selectedItem?.id ? ' selected-list' : ''}`}>
      <div className='item-list-search'>
        <FormControl
          placeholder={`Search ${name}`}
          onChange={e => setSearchterm(e.target.value)}
          value={searchterm}
        />
        {searchterm && (
          <InputClear onClick={() => setSearchterm('')} />
        )}
      </div>
      {filteredItems.length === 0 && items.length > 0 && searchterm && (
        <p className='item-list-empty'>
            Found no results! <br/>
            Try another term or item ID.
        </p>
      )}
      {filteredItems.map(item => {
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

//TODO:  Add a filter system & search box!  Give it position:sticky; and put it at the top of the ItemList, then add a useState() variable to store the filtered list, as well as one for the search input, and then use a useEffect() to filter the list whenever the search input changes (by id/header/subheader if it's a string).

export default ItemList