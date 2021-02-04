import React, { useEffect, useState } from 'react'
import { Button, FormControl } from 'react-bootstrap'
import StatusDropdown, { MultiStatusDropdown } from './StatusDropdown'
import SelectionCheckbox from './SelectionCheckbox'
import ItemListElement from './ItemListElement'
import InputClear from '../util/InputClear'
import Badge from './Badge'

const ItemList = ({
  name = 'items', items, select, selectedItem, updateStatus, parentId, depth = 1, setStatuses, check, checked
}) => {
  const [filteredItems, setFilteredItems] = useState(items)
  const [searchterm, setSearchterm] = useState('')

  useEffect(() => {
    if (!items) return
    const exitWithDefault = () => {
      setFilteredItems(items)
      return
    }
    
    if (!searchterm || searchterm.trim().length === 0) return exitWithDefault()

    let regex = null
    let searchStatuses = null
    let statusSelectorRegex = /\s*:(((?<number>-?\d+)|(?<approved>approved|approve|approv|appro|appr|app|ap|a)|(?<rejected>rejected|rejecte|reject|rejec|reje|rej|re|r)|(?<unvetted>unvetted|unvette|unvett|unvet|unve|unv|un|u))\|?)+\b\s*/gi
    let editedSearchterm = searchterm.replace(statusSelectorRegex, '')
    
    try {
      if (editedSearchterm.length !== searchterm.length) searchStatuses = statusSelectorRegex.exec(searchterm)
      let term = (searchStatuses ? editedSearchterm : searchterm).split('&')
      regex = term.map(text => new RegExp(text.trim(), 'gi'))
    } catch (e) {
      try {
        let term = searchStatuses ? editedSearchterm : searchterm
        let replaced = term.trim().replace(/[{}()[\\]/g, '\\$&').split('&')
        regex = replaced.map(text => new RegExp(text.trim(), 'gi'))
      } catch (_e) {}
    }
    if (!regex) return exitWithDefault()
    
    let header = null
    let newFilteredItems = []
    items.forEach(item => {
      if (item.IS_HEADER) header = item
      if (item.IS_HEADER || !item.id || !item.header || (!item.subheader && item.subheader !== '')) return

      let fields = [`ID ${item.id}`, item.header, item.subheader]
      if (item?.badges?.collection) fields.push(item.badges.collection)
      if (item?.badges?.duplicates) fields.push(
        `${item.badges.duplicates} duplicates`,
        `${item.badges.duplicates} dupes`
      )
      let match = regex.every(r => fields.some(field => r.test(field)))
      
      let status = item?.badges?.currentStatus
      if (searchStatuses && Number.isInteger(status) && match) {
        let { approved, rejected, unvetted, number = null } = (searchStatuses?.groups || {})
        let statusNumber = number !== null ? parseInt(number) : null

        if (status === 1 && !approved) match = false
        else if (status < 0 && !rejected) match = false
        else if ((status === 0 || status > 1) && !unvetted) match = false
        
        if (statusNumber !== null && statusNumber !== status) match = false
        else if (statusNumber !== null && statusNumber === status) match = true
      }

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

  const checkedItems = Object.values(checked || {}).length

  return (
    <div className={`item-list list-${depth}${selectedItem?.id ? ' selected-list' : ''}`}>
      {items.length > 0 && (
        <div className='item-list-search'>
          {searchterm.trim() && (
            <>
              <InputClear onClick={() => setSearchterm('')} />
              <Badge number={filteredItems.length} suffix={filteredItems.length === 1 ? 'result' : 'results'} />
            </>
          )}
          <FormControl
            placeholder={`Search ${name}`}
            onChange={e => setSearchterm(e.target.value)}
            value={searchterm}
          />
        </div>
      )}
      {filteredItems.length === 0 && items.length > 0 && searchterm && (
        <p className='item-list-empty'>
          Found no results! <br/>
          Try another term or item ID.
        </p>
      )}
      {filteredItems.map(item => {
        const STATUS = item.badges?.currentStatus
        const STATUS_SELECTOR = (Number.isInteger(STATUS) && updateStatus && parentId) && (
          <StatusDropdown
            status={STATUS}
            select={updateStatus}
            catId={parentId}
            id={item.id}
            className='item-list-dropdown'
          />
        )

        const CHECKBOX = (check && checked && setStatuses) && (
          <SelectionCheckbox
            onClick={e => {
              e.stopPropagation()
              check(item.id)
            }}
            value={checked[item.id]}
            divClass='item-list-checkbox'
          />
        )

        return (
          <ItemListElement
            item={item}
            select={select}
            checkbox={CHECKBOX}
            statusSelector={STATUS_SELECTOR}
            isSelected={item.id === selectedItem?.id}
            key={`list${depth}-id${item.id || item.header}`}
          />
        )
      })}
      {checkedItems > 0 && check && (
        <div className='list-selected-buttons'>
          <MultiStatusDropdown
            className='checkbox-status-select'
            text={`Set Status for ${checkedItems} Nominees`}
            select={setStatuses}
          />
          <Button
            className='checkbox-deselect'
            variant='dark'
            onClick={() => check(null, true)}
          >
            Deselect all
          </Button>
        </div>
      )}
    </div>
  )
}

export default ItemList