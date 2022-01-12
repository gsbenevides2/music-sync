import React from 'react'

import { ImageSpecial } from './ImageSpecial'

export interface MediumListItem {
  id: string
  title: string
  subtitle?: string
  imageSrc: string
}

interface Props {
  ulClassName?: string
  ulStyle?: React.CSSProperties
  listOfItems: MediumListItem[]
  onClick?: (id: string) => void
  onRightClick?: (id: string) => void
  onDragHandler?: (from: string, to: string) => void
}

const MediumList: React.FC<Props> = props => {
  const isDragable = Boolean(props.onDragHandler)
  function handleDragStart(e: React.DragEvent<HTMLElement>, id: string) {
    if (!isDragable) return
    e.dataTransfer.dropEffect = 'move'
    e.dataTransfer.setData('text/plain', id)
  }
  function handleDargOver(e: React.DragEvent<HTMLElement>) {
    if (!isDragable) return
    e.preventDefault()
    e.dataTransfer.effectAllowed = 'move'
  }
  function handleDrop(e: React.DragEvent<HTMLElement>, id: string) {
    if (!isDragable) return
    e.preventDefault()
    const from = e.dataTransfer.getData('text/plain')
    props.onDragHandler?.(from, id)
  }

  return (
    <ul className={props.ulClassName} style={props.ulStyle}>
      {props.listOfItems.map(item => (
        <li
          key={item.id}
          className={`flex ${
            isDragable ? 'cursor-move' : 'cursor-pointer'
          } justify-between hover-black pointer p-2`}
          onClick={() => props.onClick?.(item.id)}
          onContextMenu={e => {
            props.onRightClick?.(item.id)
          }}
          draggable={isDragable}
          onDragStart={e => {
            handleDragStart(e, item.id)
          }}
          onDragOver={handleDargOver}
          onDrop={e => handleDrop(e, item.id)}
        >
          <div className="flex">
            <ImageSpecial
              src={item.imageSrc}
              style={{ height: 'calc(10vh)' }}
            />
            <div className="flex flex-col m-1">
              <span>{item.title}</span>
              {item.subtitle ? (
                <span className="text-sm">{item.subtitle}</span>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="self-center grid grid-cols-4 gap-1 pr-4"></div>
        </li>
      ))}
    </ul>
  )
}

export default React.memo(MediumList)
