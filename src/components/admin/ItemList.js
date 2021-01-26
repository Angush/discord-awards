import React from 'react'

const ItemList = ({ items, select, selectedItem, depth = 1 }) => {
  return (
    <div className={`item-list list-${depth}${selectedItem ? ' selected-list' : ''}`}>
      {items.map(item => (
        <div
          key={item.id}
          className={`item-list-element ${item.id === selectedItem?.id ? 'selected-list-element' : ''}`}
          onClick={() => select(item.id === selectedItem?.id ? null : item.id)}
        >
          <h1>{item.header}</h1>
          <h2 className="text-muted">{item.subheader}</h2>
        </div>
      ))}
    </div>
  )
}

export default ItemList