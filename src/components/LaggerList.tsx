import React from 'react'

import { ImageSpecial } from './ImageSpecial'

export interface LaggerListItem {
  id: string
  title: string
  subtitle?: string
  imageSrc: string
}

interface Props {
  listOfItems: LaggerListItem[]
  onClick?: (id: string) => void
  onRightClick?: (id: string) => void
  minimal?: boolean
  lowerMargin?: boolean
}

const LaggerList: React.FC<Props> = props => {
  return (
    <ul
      className="flex flex-auto flex-wrap gap-3 justify-center overflow-y-auto hiden-scroll py-1"
      style={{
        maxWidth: '800px',
        height: `calc(100vh - (0.75rem + ${
          (props.minimal ? 28 : 90) + (props.lowerMargin ? 4 : 12)
        }px + var(--player-height) + 0.50rem))`
      }}
    >
      {props.listOfItems.map(item => (
        <li
          key={item.id}
          style={{ maxHeight: 184 }}
          className="w-24 cursor-pointer duration-300 transform scale-100 hover:scale-105 hover:bg-app-200 hover:text-app-900 p-1 rounded"
          onClick={() => props.onClick?.(item.id)}
          onContextMenu={e => {
            e.preventDefault()
            props.onRightClick?.(item.id)
            return false
          }}
        >
          <ImageSpecial
            src={item.imageSrc}
            className="h-24 w-24"
            loading="lazy"
          />
          <p className="break-words overflow-hidden" style={{ height: 46 }}>
            {item.title}
          </p>
          {item.subtitle ? (
            <p className="text-sm truncate">{item.subtitle}</p>
          ) : (
            <></>
          )}
        </li>
      ))}
    </ul>
  )
}

export default LaggerList
