import React from 'react'

export interface LaggerListItem {
  id: string
  title: string
  subtitle: string
  imageSrc: string
}

interface Props {
  listOfItems: LaggerListItem[]
  onClick?: (id: string) => void
}

const LaggerList: React.FC<Props> = props => {
  return (
    <ul className="flex flex-auto flex-wrap gap-3 justify-center max-w-screen-2xl 2xl:fixed xl:left-2/4 2xl:transform 2xl:-translate-x-2/4">
      {props.listOfItems.map(item => (
        <li
          key={item.id}
          style={{ maxHeight: 184 }}
          className="w-24 cursor-pointer duration-300 transform scale-100 hover:scale-105 hover:bg-app-200 hover:text-app-900 p-1 rounded"
          onClick={() => props.onClick?.(item.id)}
        >
          <img src={item.imageSrc} className="h-24 w-24" loading="lazy" />
          <p className="break-words overflow-hidden" style={{ height: 46 }}>
            {item.title}
          </p>
          <p className="text-sm truncate">{item.subtitle}</p>
        </li>
      ))}
    </ul>
  )
}

export default LaggerList
