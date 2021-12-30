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
}

const MediumList: React.FC<Props> = props => {
  return (
    <ul className={props.ulClassName} style={props.ulStyle}>
      {props.listOfItems.map(item => (
        <li
          key={item.id}
          className="flex justify-between hover-black pointer p-2 "
          onClick={() => {
            props.onClick?.(item.id)
          }}
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

export default MediumList
